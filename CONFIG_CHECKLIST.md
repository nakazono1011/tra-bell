# 設定チェックリスト

プロジェクトを起動する前に、以下の設定が完了しているか確認してください。

---

## ✅ 必須設定

### 1. 環境変数ファイルの作成

- [ ] `.env.local` ファイルをプロジェクトルートに作成
- [ ] 以下の環境変数を設定

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_GENERATIVE_AI_API_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase PostgreSQL の設定

- [ ] Supabase アカウントを作成
- [ ] 新しいプロジェクトを作成
- [ ] Connection Pooler を有効化（Transaction mode）
- [ ] 接続文字列を取得して `DATABASE_URL` に設定
- [ ] データベースマイグレーションを実行: `pnpm db:push`

### 3. Google OAuth の設定

- [ ] Google Cloud Console でプロジェクトを作成
- [ ] OAuth 同意画面を設定
  - [ ] ユーザータイプ: 外部（一般公開）
  - [ ] アプリ名を設定
  - [ ] スコープを追加:
    - `openid`
    - `email`
    - `profile`
    - `https://www.googleapis.com/auth/gmail.readonly`
- [ ] OAuth クライアント ID を作成
  - [ ] アプリケーションの種類: ウェブアプリケーション
  - [ ] リダイレクト URI を追加: `http://localhost:3000/api/auth/callback/google`
- [ ] Gmail API を有効化
- [ ] クライアント ID とシークレットを `.env.local` に設定

### 3.5. Google Generative AI (Gemini) の設定

- [ ] Google Cloud Console で Generative AI API を有効化
- [ ] API キーを作成（[Google AI Studio](https://makersuite.google.com/app/apikey) から取得可能）
- [ ] `.env.local` の `GOOGLE_GENERATIVE_AI_API_KEY` に設定
- 注: 楽天トラベルの予約メール解析に使用されます

### 4. Better Auth シークレットの生成

- [ ] `openssl rand -base64 32` でシークレットを生成
- [ ] `.env.local` の `BETTER_AUTH_SECRET` に設定

---

## 🔧 オプション設定

### 5. 楽天トラベル API（将来の実装用）

- [ ] 楽天トラベル API アプリケーション ID を取得
- [ ] `.env.local` の `RAKUTEN_APPLICATION_ID` に設定
- 注: 現在はモック実装のため、設定しなくても動作します

### 6. Vercel デプロイ（本番環境）

- [ ] Vercel アカウントを作成
- [ ] GitHub リポジトリをインポート
- [ ] 環境変数を設定:
  - `DATABASE_URL`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL` (本番 URL)
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_GENERATIVE_AI_API_KEY`
  - `NEXT_PUBLIC_APP_URL` (本番 URL)
  - `CRON_SECRET`
- [ ] Google OAuth のリダイレクト URI に本番 URL を追加

---

## 🧪 動作確認

### 7. 開発サーバーの起動

- [ ] `pnpm install` で依存関係をインストール
- [ ] `pnpm dev` で開発サーバーを起動
- [ ] `http://localhost:3000` にアクセス
- [ ] Google ログインが動作するか確認
- [ ] Gmail 連携が動作するか確認

### 8. データベース確認

- [ ] Supabase ダッシュボードでテーブルが作成されているか確認
- [ ] 以下のテーブルが存在するか確認:
  - `user`
  - `session`
  - `account`
  - `verification`
  - `reservation`
  - `price_history`
  - `notification`
  - `user_settings`

---

## 📋 設定値の確認方法

### 環境変数の確認

```bash
# 環境変数が正しく読み込まれているか確認
node -e "console.log(process.env.DATABASE_URL)"
```

### データベース接続の確認

```bash
# Drizzle Studioでデータベースを確認
pnpm db:studio
```

### Google OAuth の確認

1. ブラウザで `http://localhost:3000/sign-in` にアクセス
2. 「Google でログイン」をクリック
3. Google 認証画面が表示されるか確認
4. ログイン後、ダッシュボードにリダイレクトされるか確認

---

## ⚠️ よくある問題

### データベース接続エラー

**症状:** `Error: connect ECONNREFUSED` または `Connection refused`

**解決方法:**

- Supabase の接続文字列が正しいか確認
- Connection Pooler が有効になっているか確認
- パスワードが正しいか確認
- ポート番号が `6543` (Transaction mode) になっているか確認

### Google OAuth エラー

**症状:** `redirect_uri_mismatch` エラー

**解決方法:**

- Google Cloud Console でリダイレクト URI が正しく設定されているか確認
- `http://localhost:3000/api/auth/callback/google` が追加されているか確認
- 本番環境の場合は `https://your-domain.com/api/auth/callback/google` も追加

**症状:** `access_denied` エラー

**解決方法:**

- OAuth 同意画面が公開されているか確認
- スコープに `gmail.readonly` が含まれているか確認
- Gmail API が有効になっているか確認

### Better Auth エラー

**症状:** セッションが作成されない

**解決方法:**

- `BETTER_AUTH_SECRET` が設定されているか確認
- `BETTER_AUTH_URL` が正しいか確認
- ブラウザのコンソールでエラーを確認

---

## 📚 参考ドキュメント

詳細な設定手順は `SETUP.md` を参照してください。
