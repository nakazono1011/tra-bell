# ホテル予約AIエージェント 要件定義書

## プロジェクト概要

ホテルの宿泊予約がキャンセル料発生前に値下がりした場合、自動でキャンセル・再予約を行い、ユーザーが最も安くホテルに宿泊できるようにするAIエージェント。

---

## 機能要件

### 1. 認証機能

- **サインアップ/サインイン**: Googleログインのみ対応
- **セッション管理**: Better Authによるセッション管理
- **OAuth スコープ**: 
  - 基本プロフィール情報
  - Gmail読み取り権限（gmail.readonly）

### 2. Gmail連携機能

- **メール読み取り権限**: ユーザーの許可を得てGmailにアクセス
- **予約確認メール検索**: 楽天トラベル・じゃらんからの予約確認メールを自動検索
- **メール解析**: 予約情報（ホテル名、日程、料金、予約番号、キャンセル期限）を抽出

### 3. 予約管理機能

- **予約一覧表示**: ユーザーの全予約を一覧表示
- **予約詳細表示**: 各予約の詳細情報を表示
- **価格履歴表示**: 予約ごとの価格推移をグラフ表示

### 4. 価格監視機能

- **定期的な価格チェック**: Vercel Cron Functionsで定期実行
- **価格変動記録**: 価格履歴をデータベースに保存
- **値下がり通知**: 設定した閾値以上の値下がりを検知して通知

### 5. 自動キャンセル・再予約機能

- **キャンセル期限チェック**: キャンセル料発生前かを確認
- **空室確認**: 再予約可能かを確認
- **自動キャンセル**: 現在の予約をキャンセル
- **自動再予約**: より安い価格で再予約
- **処理結果通知**: ユーザーに処理結果を通知

### 6. 設定機能

- **価格監視閾値**: 値下がり通知の閾値設定（金額 or パーセンテージ）
- **自動処理設定**: 自動キャンセル・再予約の有効/無効
- **通知設定**: 通知方法の設定

---

## 技術スタック

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| フレームワーク | Next.js 16 (App Router) | フルスタックフレームワーク |
| 認証 | Better Auth | Google OAuth認証 |
| データベース | Supabase PostgreSQL | データ永続化 |
| ORM | Drizzle ORM | データベース操作 |
| API | Hono | APIエンドポイント |
| URL状態管理 | nuqs | URLパラメータ管理 |
| データフェッチング | SWR | クライアントサイドデータ取得 |
| AI | Vercel AI SDK | AI機能統合 |
| フォーム | React Hook Form | フォーム管理 |
| 日付処理 | date-fns | 日付操作 |
| UI | Tailwind CSS + shadcn/ui | スタイリング・UIコンポーネント |
| デプロイ | Vercel | ホスティング・Cron Functions |

---

## 対象予約サイト

- **楽天トラベル**: 楽天トラベルAPI使用
- **じゃらん**: スクレイピング or API

---

## データベース設計

### users テーブル（Better Auth管理）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| email | varchar | メールアドレス |
| name | varchar | ユーザー名 |
| image | varchar | プロフィール画像URL |
| emailVerified | boolean | メール確認済みフラグ |
| createdAt | timestamp | 作成日時 |
| updatedAt | timestamp | 更新日時 |

### accounts テーブル（Better Auth管理）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| userId | uuid | ユーザーID（外部キー） |
| providerId | varchar | プロバイダーID（google） |
| accountId | varchar | プロバイダーでのアカウントID |
| accessToken | text | アクセストークン |
| refreshToken | text | リフレッシュトークン |
| accessTokenExpiresAt | timestamp | アクセストークン有効期限 |
| scope | text | 許可されたスコープ |

### sessions テーブル（Better Auth管理）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| userId | uuid | ユーザーID（外部キー） |
| token | varchar | セッショントークン |
| expiresAt | timestamp | 有効期限 |
| ipAddress | varchar | IPアドレス |
| userAgent | text | ユーザーエージェント |

### reservations テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| userId | uuid | ユーザーID（外部キー） |
| hotelName | varchar | ホテル名 |
| checkInDate | date | チェックイン日 |
| checkOutDate | date | チェックアウト日 |
| originalPrice | integer | 予約時の価格 |
| currentPrice | integer | 現在の価格 |
| reservationSite | varchar | 予約サイト（rakuten/jalan） |
| reservationId | varchar | 予約番号 |
| cancellationDeadline | timestamp | キャンセル期限 |
| status | varchar | ステータス（active/cancelled/rebooked） |
| hotelUrl | text | ホテルページURL |
| roomType | varchar | 部屋タイプ |
| createdAt | timestamp | 作成日時 |
| updatedAt | timestamp | 更新日時 |

### price_history テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| reservationId | uuid | 予約ID（外部キー） |
| price | integer | 価格 |
| checkedAt | timestamp | チェック日時 |
| sourceUrl | text | 取得元URL |

### notifications テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| userId | uuid | ユーザーID（外部キー） |
| reservationId | uuid | 予約ID（外部キー、nullable） |
| type | varchar | 通知タイプ（price_drop/auto_cancel/auto_rebook） |
| message | text | 通知メッセージ |
| isRead | boolean | 既読フラグ |
| createdAt | timestamp | 作成日時 |

### user_settings テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | uuid | 主キー |
| userId | uuid | ユーザーID（外部キー、ユニーク） |
| priceDropThreshold | integer | 値下がり通知閾値（円） |
| priceDropPercentage | integer | 値下がり通知閾値（%） |
| autoRebookEnabled | boolean | 自動再予約有効フラグ |
| gmailConnected | boolean | Gmail連携済みフラグ |
| createdAt | timestamp | 作成日時 |
| updatedAt | timestamp | 更新日時 |

---

## ディレクトリ構成

```
hotel/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── reservations/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/[...all]/
│   │   │   └── route.ts
│   │   ├── gmail/
│   │   │   ├── connect/
│   │   │   │   └── route.ts
│   │   │   └── fetch-reservations/
│   │   │       └── route.ts
│   │   ├── reservations/
│   │   │   └── route.ts
│   │   ├── prices/
│   │   │   └── check/
│   │   │       └── route.ts
│   │   └── cron/
│   │       └── check-prices/
│   │           └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   └── (shadcn components)
│   ├── auth/
│   │   └── google-sign-in-button.tsx
│   ├── dashboard/
│   │   ├── reservation-card.tsx
│   │   ├── reservation-list.tsx
│   │   └── price-chart.tsx
│   └── layout/
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
├── db/
│   ├── index.ts
│   └── schema.ts
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── gmail/
│   │   ├── client.ts
│   │   └── parser.ts
│   ├── parsers/
│   │   ├── rakuten.ts
│   │   └── jalan.ts
│   ├── price-checker/
│   │   ├── rakuten.ts
│   │   └── jalan.ts
│   └── utils.ts
├── hooks/
│   ├── use-auth.ts
│   ├── use-reservations.ts
│   └── use-settings.ts
├── types/
│   └── index.ts
├── drizzle/
│   └── (migrations)
├── public/
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── SPECIFICATION.md
```

---

## API エンドポイント

### 認証

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| ALL | /api/auth/* | Better Auth ハンドラー |

### Gmail連携

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/gmail/connect | Gmail連携開始 |
| GET | /api/gmail/fetch-reservations | 予約メール取得・解析 |

### 予約管理

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/reservations | 予約一覧取得 |
| GET | /api/reservations/:id | 予約詳細取得 |
| POST | /api/reservations | 予約追加（手動） |
| DELETE | /api/reservations/:id | 予約削除 |

### 価格監視

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/prices/check | 手動価格チェック |
| GET | /api/prices/history/:reservationId | 価格履歴取得 |

### Cron

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/cron/check-prices | 定期価格チェック（Vercel Cron） |

---

## 環境変数

```env
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel
CRON_SECRET=your-cron-secret
```

---

## 実装フェーズ

### Phase 1: 認証基盤の構築
- Better Auth設定
- Google OAuth設定（Gmail スコープ含む）
- サインイン/サインアウトUI

### Phase 2: データベース設計
- Supabase PostgreSQL設定
- Drizzle ORMスキーマ定義
- マイグレーション実行

### Phase 3: Gmail連携機能
- Gmail API連携
- 予約確認メールパーサー（楽天トラベル・じゃらん）
- 予約情報のDB保存

### Phase 4: 価格監視機能
- 楽天トラベルAPI連携
- じゃらん価格取得
- Vercel Cron Functions設定

### Phase 5: 自動キャンセル・再予約機能
- キャンセル処理実装
- 再予約処理実装
- 通知機能

### Phase 6: フロントエンドUI完成
- ダッシュボード
- 予約一覧・詳細
- 設定画面
- 価格推移グラフ

---

## セキュリティ考慮事項

1. **トークン管理**: アクセストークン・リフレッシュトークンは暗号化して保存
2. **スコープ最小化**: 必要最小限のGmail権限のみ要求
3. **CSRF対策**: Better Authの組み込み保護を使用
4. **環境変数**: 機密情報は環境変数で管理
5. **Cron認証**: Cron エンドポイントはシークレットで保護



