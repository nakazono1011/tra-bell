import { google } from "googleapis";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { GmailMessage } from "@/types";

export class GmailClient {
  private accessToken: string;
  private refreshToken: string | null;
  private userId: string;

  constructor(
    accessToken: string,
    refreshToken: string | null,
    userId: string
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }

  /**
   * ユーザーのGmailクライアントを作成
   */
  static async fromUserId(userId: string): Promise<GmailClient | null> {
    const [userAccount] = await db
      .select()
      .from(accounts)
      .where(
        and(eq(accounts.userId, userId), eq(accounts.providerId, "google"))
      )
      .limit(1);

    if (!userAccount || !userAccount.accessToken) {
      return null;
    }

    return new GmailClient(
      userAccount.accessToken,
      userAccount.refreshToken,
      userId
    );
  }

  /**
   * トークンをデータベースに保存
   */
  private async saveTokens(accessToken: string, refreshToken: string | null) {
    await db
      .update(accounts)
      .set({
        accessToken,
        refreshToken,
        updatedAt: new Date(),
      })
      .where(
        and(eq(accounts.userId, this.userId), eq(accounts.providerId, "google"))
      );

    // インスタンスのトークンも更新
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  /**
   * データベースから最新のトークンを取得
   */
  private async refreshTokensFromDb() {
    const [userAccount] = await db
      .select()
      .from(accounts)
      .where(
        and(eq(accounts.userId, this.userId), eq(accounts.providerId, "google"))
      )
      .limit(1);

    if (userAccount?.accessToken) {
      this.accessToken = userAccount.accessToken;
      if (userAccount.refreshToken) {
        this.refreshToken = userAccount.refreshToken;
      }
    }
  }

  /**
   * OAuth2クライアントを作成
   */
  private async getOAuth2Client() {
    // データベースから最新のトークンを取得
    await this.refreshTokensFromDb();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    });

    // トークンがリフレッシュされたときにデータベースに保存
    oauth2Client.on("tokens", async (tokens) => {
      if (tokens.access_token) {
        await this.saveTokens(
          tokens.access_token,
          tokens.refresh_token || this.refreshToken
        );
      }
    });

    return oauth2Client;
  }

  /**
   * Gmail APIクライアントを取得
   */
  private async getGmailApi() {
    return google.gmail({
      version: "v1",
      auth: await this.getOAuth2Client(),
    });
  }

  /**
   * メッセージ一覧から詳細を取得
   */
  private async fetchMessageDetails(
    gmail: ReturnType<typeof google.gmail>,
    messageIds: Array<{ id?: string | null }>
  ): Promise<GmailMessage[]> {
    const fullMessages: GmailMessage[] = [];

    for (const message of messageIds) {
      if (!message.id) continue;

      const messageResponse = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      if (messageResponse.data) {
        fullMessages.push(messageResponse.data as unknown as GmailMessage);
      }
    }

    return fullMessages;
  }

  /**
   * ホテル予約確認メールを検索
   */
  async searchReservationEmails(
    maxResults: number = 50,
    afterDate?: Date
  ): Promise<GmailMessage[]> {
    // 検索クエリを構築
    const queries: string[] = [
      // 楽天トラベルの予約確認メール
      'from:travel@mail.travel.rakuten.co.jp subject:"予約完了"',
      // じゃらんの予約確認メール
      'from:jalan@mail.jalan.net subject:"予約"',
    ];

    // 日付フィルター
    if (afterDate) {
      const dateStr = afterDate.toISOString().split("T")[0].replace(/-/g, "/");
      queries.push(`after:${dateStr}`);
    }

    const searchQuery = `(${queries.slice(0, 2).join(" OR ")})${
      queries.length > 2 ? ` ${queries[2]}` : ""
    }`;

    try {
      const gmail = await this.getGmailApi();

      // メッセージ一覧を取得
      const listResponse = await gmail.users.messages.list({
        userId: "me",
        q: searchQuery,
        maxResults,
      });

      const messages = listResponse.data.messages || [];
      return await this.fetchMessageDetails(gmail, messages);
    } catch (error) {
      // 認証エラーの場合、トークンをリフレッシュして再試行
      const isAuthError =
        (error as { code?: number; response?: { status?: number } })?.code ===
          401 ||
        (error as { code?: number; response?: { status?: number } })?.response
          ?.status === 401;
      if (isAuthError) {
        console.log("Authentication error, refreshing tokens and retrying...");

        // データベースから最新のトークンを取得
        await this.refreshTokensFromDb();

        // OAuth2クライアントを再作成して再試行
        try {
          const oauth2Client = await this.getOAuth2Client();
          // トークンを強制的にリフレッシュ
          const { credentials } = await oauth2Client.refreshAccessToken();

          if (credentials.access_token) {
            await this.saveTokens(
              credentials.access_token,
              credentials.refresh_token || this.refreshToken
            );
          }

          // Gmail APIを再取得して再試行
          const gmail = google.gmail({
            version: "v1",
            auth: oauth2Client,
          });

          const listResponse = await gmail.users.messages.list({
            userId: "me",
            q: searchQuery,
            maxResults,
          });

          const messages = listResponse.data.messages || [];
          return await this.fetchMessageDetails(gmail, messages);
        } catch (retryError) {
          console.error("Error retrying Gmail API request:", retryError);
          throw new Error(
            "Gmail認証に失敗しました。再度Gmail連携を行ってください。"
          );
        }
      }

      console.error("Error fetching Gmail messages:", error);
      throw error;
    }
  }

  /**
   * メッセージのテキスト本文を取得
   */
  static extractTextFromMessage(message: GmailMessage): string {
    const { payload } = message;

    // プレーンテキストを探す
    const extractText = (parts: typeof payload.parts): string => {
      if (!parts) return "";

      for (const part of parts) {
        // text/plainパートを探す
        if (part.mimeType === "text/plain") {
          if (part.body?.data) {
            try {
              return Buffer.from(part.body.data, "base64").toString("utf-8");
            } catch (error) {
              console.error("Error decoding text body:", error);
              continue;
            }
          }
          // attachmentIdがある場合はスキップ（後で処理する必要がある）
          if (part.body?.attachmentId) {
            console.warn(
              "Text body is too large, attachmentId found:",
              part.body.attachmentId,
              "Message ID:",
              message.id
            );
            continue;
          }
        }
        // 再帰的にネストされたパーツを検索
        if (part.parts) {
          const text = extractText(part.parts);
          if (text) return text;
        }
      }
      return "";
    };

    // パーツがある場合
    if (payload.parts) {
      return extractText(payload.parts);
    }

    // 直接ボディにデータがある場合（シンプルなメッセージ）
    if (payload.body?.data) {
      try {
        return Buffer.from(payload.body.data, "base64").toString("utf-8");
      } catch (error) {
        console.error("Error decoding payload body:", error);
        return "";
      }
    }

    return "";
  }

  /**
   * メッセージのHTMLを取得
   */
  static extractHtmlFromMessage(message: GmailMessage): string {
    const { payload } = message;

    const extractHtml = (parts: typeof payload.parts): string => {
      if (!parts) return "";

      for (const part of parts) {
        // text/htmlパートを探す
        if (part.mimeType === "text/html") {
          if (part.body?.data) {
            try {
              return Buffer.from(part.body.data, "base64").toString("utf-8");
            } catch (error) {
              console.error("Error decoding HTML body:", error);
              continue;
            }
          }
          // attachmentIdがある場合はスキップ（後で処理する必要がある）
          if (part.body?.attachmentId) {
            console.warn(
              "HTML body is too large, attachmentId found:",
              part.body.attachmentId,
              "Message ID:",
              message.id
            );
            continue;
          }
        }
        // 再帰的にネストされたパーツを検索
        if (part.parts) {
          const html = extractHtml(part.parts);
          if (html) return html;
        }
      }
      return "";
    };

    // パーツがある場合
    if (payload.parts) {
      return extractHtml(payload.parts);
    }

    // 直接ボディにデータがある場合（シンプルなメッセージ）
    if (payload.body?.data) {
      try {
        return Buffer.from(payload.body.data, "base64").toString("utf-8");
      } catch (error) {
        console.error("Error decoding payload HTML body:", error);
        return "";
      }
    }

    return "";
  }

  /**
   * メッセージのヘッダーから値を取得
   */
  static getHeader(message: GmailMessage, name: string): string | undefined {
    const header = message.payload.headers.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    );
    return header?.value;
  }
}
