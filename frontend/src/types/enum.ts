export type Role = "CUSTOMER" | "MERCHANT" | "ADMIN";

export type KycStatus = "pending" | "approved" | "rejected";

export type ListingStatus = "open" | "close";

export type OrderStatus =
  | "pending_payment"
  | "paid_reserved"
  | "preparing"
  | "ready_to_pickup"
  | "completed"
  | "expired_unclaimed"
  | "cancelled";

export type PgStatus =
  | "pending"
  | "settlement"
  | "capture"
  | "deny"
  | "cancel"
  | "expire"
  | "failure"
  | "refund"
  | "partial_refund"
  | "authorize";

export type WithdrawStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";
