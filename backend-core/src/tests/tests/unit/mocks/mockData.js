/**
 * @file tests/unit/mocks/mockData.js
 * @description Shared mock data for all unit tests.
 */

// ─── IDs ───────────────────────────────────────────────────────────────────────
export const CUSTOMER_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
export const MERCHANT_ID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
export const ADMIN_ID    = "cccccccc-cccc-cccc-cccc-cccccccccccc";
export const LISTING_ID  = "dddddddd-dddd-dddd-dddd-dddddddddddd";
export const ORDER_ID    = "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee";
export const PAYMENT_ID  = BigInt(1);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const mockAuthUser = {
  id: CUSTOMER_ID,
  email: "customer@example.com",
  encrypted_password: "$2a$12$hashedpassword",
  email_confirmed_at: new Date().toISOString(),
  profile: {
    full_name: "Budi Customer",
    role: "CUSTOMER",
  },
  merchant: null,
  customer: {
    full_name: "Budi Customer",
  },
};

export const mockMerchantAuthUser = {
  id: MERCHANT_ID,
  email: "merchant@example.com",
  encrypted_password: "$2a$12$hashedpassword",
  email_confirmed_at: new Date().toISOString(),
  profile: {
    full_name: "Toko Enak",
    role: "MERCHANT",
  },
  merchant: {
    merchant_name: "Toko Enak",
    kyc_status: "approved",
    address: "Jl. Raya Batam No. 1",
    latitude: 1.1301,
    longitude: 104.0529,
    pickup_open: new Date("1970-01-01T11:00:00Z"),
    pickup_close: new Date("1970-01-01T13:00:00Z"),
    bank_name: "BCA",
    bank_account: "1234567890",
    virtual_balance: 150000,
  },
};

// ─── Listing ──────────────────────────────────────────────────────────────────
export const mockListing = {
  id: BigInt(1),
  public_id: LISTING_ID,
  name: "Nasi Padang Sisa",
  description: "Nasi padang berkualitas, sisa produksi siang",
  stock_total: 10,
  sold_total: 0,
  original_price: 30000,
  discount_price: 15000,
  discount_percentage: 50,
  open_time: new Date(Date.now() - 3_600_000).toISOString(),
  close_time: new Date(Date.now() + 3_600_000).toISOString(),
  is_open: true,
  status: "active",
  img_url: "https://example.com/nasi.jpg",
  merchant_id: MERCHANT_ID,
  deleted_at: null,
  merchant: {
    merchant_name: "Toko Enak",
    address: "Jl. Raya Batam No. 1",
    pickup_open: new Date("1970-01-01T11:00:00Z"),
    pickup_close: new Date("1970-01-01T13:00:00Z"),
  },
};

export const mockListingInvalidPrice = {
  ...mockListing,
  discount_price: 35000, // >= original_price (invalid)
};

// ─── Order ────────────────────────────────────────────────────────────────────
export const mockOrder = {
  id: BigInt(1),
  public_id: ORDER_ID,
  qty: 2,
  total_amount: 30000,
  status: "pending_payment",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  listing_id: BigInt(1),
  merchant_id: MERCHANT_ID,
  customer_id: CUSTOMER_ID,
  qr_token: null,
  order_code: "ABC123",
  order_code_active: false,
  order_code_expires_at: null,
  listing: mockListing,
  merchant: mockMerchantAuthUser.merchant,
  payment: null,
};

export const mockPaidOrder = {
  ...mockOrder,
  status: "paid_reserved",
  qr_token: "qr-token-abc",
  order_code_active: true,
};

export const mockCompletedOrder = {
  ...mockPaidOrder,
  status: "completed",
};

// ─── Payment ──────────────────────────────────────────────────────────────────
export const mockPayment = {
  id: PAYMENT_ID,
  amount: 32000,
  midtrans_trx_id: "TRX-123",
  pg_status: "pending",
  time_limit: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  order_id: BigInt(1),
  customer_id: CUSTOMER_ID,
  payment_method: "qris",
  qris_url: "https://example.com/qris.png",
  paid_at: null,
};

export const mockSettledPayment = {
  ...mockPayment,
  pg_status: "settlement",
  paid_at: new Date().toISOString(),
};

// ─── Withdrawal ───────────────────────────────────────────────────────────────
export const mockWithdrawal = {
  id: BigInt(1),
  merchant_id: MERCHANT_ID,
  admin_id: null,
  amount: 100000,
  qty: BigInt(5),
  status: "pending",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockCompletedWithdrawal = {
  ...mockWithdrawal,
  status: "completed",
  admin_id: ADMIN_ID,
};

// ─── User / Merchant ──────────────────────────────────────────────────────────
export const mockMerchant = {
  user_id: MERCHANT_ID,
  merchant_name: "Toko Enak",
  kyc_status: "pending",
  address: "Jl. Raya Batam No. 1",
  latitude: 1.1301,
  longitude: 104.0529,
  bank_name: "BCA",
  bank_account: "1234567890",
  virtual_balance: 150000,
};

export const mockCustomer = {
  user_id: CUSTOMER_ID,
  full_name: "Budi Customer",
  exp: 0,
  strike_count: 0,
};
