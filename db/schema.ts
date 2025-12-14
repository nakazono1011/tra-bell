import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  index,
  date,
} from "drizzle-orm/pg-core";

// ==========================================
// Better Auth Tables
// ==========================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ==========================================
// Application Tables
// ==========================================

// 予約サイトの種類
export type ReservationSite = "rakuten" | "jalan";

// 予約ステータス
export type ReservationStatus = "active" | "cancelled" | "rebooked";

// 通知タイプ
export type NotificationType =
  | "price_drop"
  | "auto_cancel"
  | "auto_rebook"
  | "info";

// 予約情報テーブル
export const reservation = pgTable(
  "reservation",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hotelName: text("hotel_name").notNull(),
    checkInDate: date("check_in_date").notNull(),
    checkOutDate: date("check_out_date").notNull(),
    originalPrice: integer("original_price").notNull(),
    currentPrice: integer("current_price").notNull(),
    reservationSite: text("reservation_site")
      .$type<ReservationSite>()
      .notNull(),
    reservationId: text("reservation_id").notNull(),
    cancellationDeadline: timestamp("cancellation_deadline"),
    status: text("status")
      .$type<ReservationStatus>()
      .default("active")
      .notNull(),
    hotelUrl: text("hotel_url"),
    roomType: text("room_type"),
    guestCount: integer("guest_count"),
    emailMessageId: text("email_message_id"), // Gmailのメッセージ ID
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("reservation_userId_idx").on(table.userId),
    index("reservation_status_idx").on(table.status),
  ]
);

// 価格履歴テーブル
export const priceHistory = pgTable(
  "price_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reservationId: uuid("reservation_id")
      .notNull()
      .references(() => reservation.id, { onDelete: "cascade" }),
    price: integer("price").notNull(),
    checkedAt: timestamp("checked_at").defaultNow().notNull(),
    sourceUrl: text("source_url"),
  },
  (table) => [index("price_history_reservationId_idx").on(table.reservationId)]
);

// 通知テーブル
export const notification = pgTable(
  "notification",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reservationId: uuid("reservation_id").references(() => reservation.id, {
      onDelete: "set null",
    }),
    type: text("type").$type<NotificationType>().notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notification_userId_idx").on(table.userId),
    index("notification_isRead_idx").on(table.isRead),
  ]
);

// ユーザー設定テーブル
export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  priceDropThreshold: integer("price_drop_threshold").default(500), // 値下がり通知閾値（円）
  priceDropPercentage: integer("price_drop_percentage").default(5), // 値下がり通知閾値（%）
  autoRebookEnabled: boolean("auto_rebook_enabled").default(false), // 自動再予約有効フラグ
  gmailConnected: boolean("gmail_connected").default(false), // Gmail連携済みフラグ
  gmailLastSyncAt: timestamp("gmail_last_sync_at"), // Gmail最終同期日時
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// ==========================================
// Type Exports
// ==========================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Reservation = typeof reservation.$inferSelect;
export type NewReservation = typeof reservation.$inferInsert;

export type PriceHistory = typeof priceHistory.$inferSelect;
export type NewPriceHistory = typeof priceHistory.$inferInsert;

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;

// ==========================================
// Waitlist Tables
// ==========================================

// ウェイトリストテーブル
export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("waitlist_email_idx").on(table.email)]
);

// ウェイトリストアンケートテーブル
export const waitlistSurvey = pgTable("waitlist_survey", {
  id: uuid("id").defaultRandom().primaryKey(),
  waitlistId: uuid("waitlist_id")
    .notNull()
    .references(() => waitlist.id, { onDelete: "cascade" }),
  ota: text("ota").notNull(), // 普段利用するOTA
  osOrNotification: text("os_or_notification").notNull(), // OS/通知希望
  bookingTiming: text("booking_timing").notNull(), // 予約タイミング
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type NewWaitlist = typeof waitlist.$inferInsert;

export type WaitlistSurvey = typeof waitlistSurvey.$inferSelect;
export type NewWaitlistSurvey = typeof waitlistSurvey.$inferInsert;
