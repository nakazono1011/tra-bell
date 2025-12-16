# セットアップガイド

このドキュメントでは、Tra-bell プロジェクトをセットアップするために必要な設定を説明します。

---

## 1. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください。

### 必須環境変数

```env
# ==========================================
# データベース設定（Supabase PostgreSQL）
# ==========================================
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# ==========================================
# Better Auth設定
# ==========================================
# 認証用のシークレットキー（32文字以上のランダム文字列）
# 生成方法: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# アプリケーションのベースURL
# 開発環境: http://localhost:3000
# 本番環境: https://your-domain.com
BETTER_AUTH_URL=http://localhost:3000

# ==========================================
# Google OAuth設定
# ==========================================
# Google Cloud Console (https://console.cloud.google.com/) で取得
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ==========================================
# Google Generative AI (Gemini) 設定
# ==========================================
# Google AI Studio (https://makersuite.google.com/app/apikey) で取得
# 楽天トラベルの予約メール解析に使用されます
GOOGLE_GENERATIVE_AI_API_KEY=your-google-generative-ai-api-key

# ==========================================
# アプリケーションURL
# ==========================================
# クライアントサイドで使用されるアプリケーションURL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# Vercel Cron設定（本番環境のみ）
# ==========================================
# Cronジョブの認証用シークレット
CRON_SECRET=your-cron-secret-here
```

### オプション環境変数

```env
# ==========================================
# 楽天トラベルAPI（将来の実装用）
# ==========================================
# 楽天トラベルAPIのアプリケーションID
# https://webservice.rakuten.co.jp/ で取得
RAKUTEN_APPLICATION_ID=your-rakuten-application-id
```

---

## 2. Supabase PostgreSQL のセットアップ

### 2.1 Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクト設定から「Database Settings」を開く
4. Connection Pooler を有効化（Transaction mode を推奨）

### 2.2 接続文字列の取得

1. Supabase ダッシュボードで「Connect」をクリック
2. 「Connection Pooler」の「Transaction」モードの接続文字列をコピー
3. パスワードを実際のパスワードに置き換える
4. `.env.local` の `DATABASE_URL` に設定

**接続文字列の形式:**

```
postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2.3 データベースマイグレーションの実行

```bash
# スキーマをデータベースに適用
pnpm db:push

# または、マイグレーションファイルを生成して適用
pnpm db:generate
```

---

## 3. Google OAuth のセットアップ

### 3.1 Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「API とサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択

### 3.2 OAuth 同意画面の設定

1. 「OAuth 同意画面」を設定
   - ユーザータイプ: 外部（一般公開）
   - アプリ名: Tra-bell
   - ユーザーサポートメール: あなたのメールアドレス
   - スコープ: 以下のスコープを追加
     - `openid`
     - `email`
     - `profile`
     - `https://www.googleapis.com/auth/gmail.readonly`

### 3.3 OAuth クライアント ID の作成

1. 「認証情報を作成」→「OAuth クライアント ID」
2. アプリケーションの種類: 「ウェブアプリケーション」
3. 承認済みのリダイレクト URI を追加:
   - 開発環境: `http://localhost:3000/api/auth/callback/google`
   - 本番環境: `https://your-domain.com/api/auth/callback/google`
4. クライアント ID とクライアント シークレットをコピー
5. `.env.local` に設定

### 3.4 Gmail API の有効化

1. 「API とサービス」→「ライブラリ」に移動
2. 「Gmail API」を検索して有効化

### 3.5 Google Generative AI (Gemini) API の設定

1. 「API とサービス」→「ライブラリ」に移動
2. 「Generative Language API」を検索して有効化
3. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
4. 「Get API Key」をクリックして API キーを作成
5. 作成した API キーをコピー
6. `.env.local` の `GOOGLE_GENERATIVE_AI_API_KEY` に設定

**注意:** 楽天トラベルの予約メール解析に Gemini API を使用します。API キーは環境変数として安全に管理してください。

---

## 4. Better Auth シークレットの生成

```bash
# ランダムなシークレットキーを生成
openssl rand -base64 32

# 生成された文字列を .env.local の BETTER_AUTH_SECRET に設定
```

---

## 5. 開発サーバーの起動

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスして動作確認してください。

---

## 6. Vercel へのデプロイ（本番環境）

### 6.1 Vercel プロジェクトの作成

1. [Vercel](https://vercel.com/) にアクセス
2. GitHub リポジトリをインポート
3. プロジェクト設定で環境変数を設定

### 6.2 環境変数の設定

Vercel ダッシュボードの「Settings」→「Environment Variables」で以下を設定:

- `DATABASE_URL` - Supabase PostgreSQL 接続文字列
- `BETTER_AUTH_SECRET` - 認証シークレット
- `BETTER_AUTH_URL` - 本番環境の URL（例: `https://your-domain.com`）
- `GOOGLE_CLIENT_ID` - Google OAuth クライアント ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth クライアント シークレット
- `GOOGLE_GENERATIVE_AI_API_KEY` - Google Generative AI (Gemini) API キー
- `NEXT_PUBLIC_APP_URL` - 本番環境の URL
- `CRON_SECRET` - Cron ジョブ認証用シークレット

### 6.3 Vercel Cron の設定

`vercel.json` が既に設定されているため、自動的に Cron ジョブが有効化されます。

価格チェックは 6 時間ごと（`0 */6 * * *`）に実行されます。

#### Cron スケジュール形式

Cron スケジュールは標準的な cron 形式（5 フィールド）を使用します:

```
分 時 日 月 曜日
0  */6  *  *  *
```

- `0 */6 * * *` - 6 時間ごと（0:00, 6:00, 12:00, 18:00）
- `0 0 * * *` - 毎日 0:00
- `0 9,18 * * *` - 毎日 9:00 と 18:00
- `0 0 * * 0` - 毎週日曜日 0:00

#### Cron エンドポイントの認証

Cron エンドポイントは以下の方法で認証されます:

1. **Vercel Cron からの自動リクエスト**: `x-vercel-signature` ヘッダーが自動的に追加され、認証されます
2. **手動トリガー**: `Authorization: Bearer <CRON_SECRET>` ヘッダーを使用して認証できます

手動で Cron を実行する場合:

```bash
curl -X GET https://your-domain.com/api/cron/check-prices \
  -H "Authorization: Bearer your-cron-secret"
```

#### スケジュールの変更

`vercel.json` の `schedule` フィールドを変更することで、実行頻度を調整できます:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-prices",
      "schedule": "0 */6 * * *"  // この値を変更
    }
  ]
}
```

変更後、Vercel に再デプロイすると新しいスケジュールが適用されます。

---

## 7. データベーススキーマの確認

以下のテーブルが作成されます:

- `user` - ユーザー情報（Better Auth 管理）
- `session` - セッション情報（Better Auth 管理）
- `account` - OAuth アカウント情報（Better Auth 管理）
- `verification` - 認証トークン（Better Auth 管理）
- `reservation` - 予約情報
- `price_history` - 価格履歴
- `notification` - 通知
- `user_settings` - ユーザー設定

---

## 8. トラブルシューティング

### データベース接続エラー

- Supabase の接続文字列が正しいか確認
- Connection Pooler が有効になっているか確認
- パスワードが正しいか確認

### Google OAuth エラー

- OAuth 同意画面が公開されているか確認
- リダイレクト URI が正しく設定されているか確認
- Gmail API が有効になっているか確認
- スコープに `gmail.readonly` が含まれているか確認

### Better Auth エラー

- `BETTER_AUTH_SECRET` が設定されているか確認
- `BETTER_AUTH_URL` が正しいか確認
- セッションクッキーが正しく設定されているか確認

---

## 9. 次のステップ

1. ✅ 環境変数の設定
2. ✅ Supabase データベースのセットアップ
3. ✅ Google OAuth の設定
4. ✅ データベースマイグレーションの実行
5. ✅ 開発サーバーの起動
6. ✅ Google ログインのテスト
7. ✅ Gmail 連携のテスト
8. ✅ 予約メールの取得テスト

---

## 10. 参考リンク

- [Supabase Documentation](https://supabase.com/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Documentation](https://vercel.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
