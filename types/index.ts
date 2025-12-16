import type {
  User,
  Session,
  Account,
  Reservation,
  PriceHistory,
  Notification,
  UserSettings,
  ReservationSite,
  ReservationStatus,
  NotificationType,
} from "@/db/schema";

// Re-export types from schema
export type {
  User,
  Session,
  Account,
  Reservation,
  PriceHistory,
  Notification,
  UserSettings,
  ReservationSite,
  ReservationStatus,
  NotificationType,
};

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Reservation with price history
export interface ReservationWithHistory extends Reservation {
  priceHistory: PriceHistory[];
}

// Gmail API types
export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: GmailPayload;
  internalDate: string;
}

export interface GmailPayload {
  headers: GmailHeader[];
  body?: GmailBody;
  parts?: GmailPart[];
}

export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailBody {
  size: number;
  data?: string;
  attachmentId?: string;
}

export interface GmailPart {
  mimeType: string;
  body: GmailBody;
  parts?: GmailPart[];
}

// Parsed reservation from email
export interface ParsedReservation {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  reservationId: string;
  reservationSite: ReservationSite;
  cancellationDeadline?: string;
  roomType?: string;
  adultCount?: number;
  childCount?: number;
  roomCount?: number;
  hotelUrl?: string;
  planName?: string;
  planUrl?: string;
  hotelId?: string;
  hotelPostalCode?: string;
  hotelAddress?: string;
  hotelTelNo?: string;
  roomThumbnailUrl?: string;
}

// Price check result
export interface PriceCheckResult {
  reservationId: string;
  previousPrice: number;
  currentPrice: number;
  priceDropAmount: number;
  priceDropPercentage: number;
  isSignificantDrop: boolean;
  checkedAt: Date;
}
