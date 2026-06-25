# Requirements Document

## Introduction

This document specifies the requirements for the `backend-core` REST API of the SaveBite platform — a food waste recovery marketplace built on Express.js ESM with Prisma ORM and PostgreSQL. The API covers three functional modules: **Authentication** (`/auth`), **Listing** (`/listing`), and **Order & Transaction** (`/order`). The primary objectives are to fix all field-name mismatches between the existing skeleton code and the Prisma schema, implement missing endpoints (QR scan verification, Midtrans webhook, soft-delete), implement the timeout cron job, write all validators, and ensure each layer (Controller → Service → Repository) is internally consistent. Every change must be recorded in `ai_backend-core_history.md`, and every function must carry inline explanatory comments.

---

## Glossary

- **System**: The Express.js `backend-core` REST API.
- **Auth_Service**: The `src/services/auth.service.js` module responsible for authentication business logic.
- **Auth_Repository**: The `src/repositories/auth.repository.js` module responsible for Prisma user/merchant queries.
- **Auth_Controller**: The `src/controllers/auth.controller.js` module responsible for HTTP serialisation on `/auth` routes.
- **Listing_Service**: The `src/services/listing.service.js` module responsible for listing business logic.
- **Listing_Repository**: The `src/repositories/listing.repository.js` module responsible for Prisma listing queries.
- **Listing_Controller**: The `src/controllers/listing.controller.js` module responsible for HTTP serialisation on `/listing` routes.
- **Order_Service**: The `src/services/order.service.js` module responsible for order business logic.
- **Order_Repository**: The `src/repositories/order.repository.js` module responsible for Prisma order queries and pessimistic locking.
- **Order_Controller**: The `src/controllers/order.controller.js` module responsible for HTTP serialisation on `/order` routes.
- **Validator**: A middleware function in `src/validators/` that validates incoming request bodies against defined rules before the controller is reached.
- **JWT**: A JSON Web Token signed with HS256 algorithm and a 15-minute TTL, issued by the System upon successful login.
- **RBAC_Middleware**: The `src/middlewares/rbac.middleware.js` `authorize()` factory that rejects requests whose `req.user.role` does not match the permitted roles for the route.
- **Auth_Middleware**: The `src/middlewares/auth.middleware.js` `authenticate()` function that extracts and verifies the Bearer JWT from the `Authorization` header.
- **Pessimistic_Lock**: A `SELECT ... FOR UPDATE` SQL statement inside a Serializable Prisma transaction used to prevent race conditions on listing stock.
- **QR_Token**: A 64-character hexadecimal string generated server-side via `crypto.randomBytes(32).toString('hex')` and stored in `Order.qrToken`.
- **Timeout_Job**: The `src/jobs/orderTimeout.job.js` cron job that runs every minute and cancels `pending_payment` orders older than 15 minutes.
- **Webhook_Handler**: The `POST /order/webhook/midtrans` route that receives payment gateway callbacks from Midtrans.
- **History_File**: The `ai_backend-core_history.md` file at the repository root, used to record every endpoint, route, controller, and repository change.
- **CUSTOMER**: The `Role` enum value for consumer users (the Prisma schema uses `CUSTOMER`, not `CONSUMER`).
- **OrderStatus**: Prisma enum — `pending_payment | paid | completed | cancelled` (all lowercase).
- **ListingStatus**: Prisma enum — `open | close` (all lowercase).
- **KycStatus**: Prisma enum — `pending | approved | rejected` (all lowercase).

---

## Requirements

### Requirement 1: Authentication — Customer Registration (`/auth/reg`)

**User Story:** As a new customer, I want to register an account with my email, password, and full name, so that I can access the SaveBite marketplace.

#### Acceptance Criteria

1. WHEN a POST request is made to `/auth/reg` with `{ email, password, fullName }`, THE Auth_Controller SHALL call the Auth_Service and return HTTP 201 with `{ message, user }` on success.
2. WHEN the request body is missing `email`, `password`, or `fullName`, THE Validator SHALL return HTTP 400 with one descriptive error entry per missing field before the controller is reached.
3. WHEN the provided `email` is already registered, THE System SHALL return HTTP 409 with an error message indicating the email conflict (propagated from Prisma error code `P2002`).
4. THE Auth_Service SHALL hash the plain-text password using `hash_password()` from `src/lib/hash.js` (bcrypt, 12 rounds) and pass the resulting hash — not the plain-text — to the Auth_Repository.
5. THE Auth_Repository `create_user()` SHALL persist the new `User` record using Prisma camelCase field names `{ email, password: <hash>, fullName, role: "CUSTOMER" }` — `password` not `password_hash`, `fullName` not `full_name`.
6. THE Auth_Repository `create_user()` SHALL return the newly created `User` object so the controller can include it in the response body.
7. WHEN `create_user()` is invoked for a CUSTOMER registration, THE Auth_Repository SHALL NOT create any `Merchant` record.
8. IF the Auth_Controller encounters an unhandled rejection, THEN THE Auth_Controller SHALL forward it via `asyncHandler()` from `src/middlewares/error.middleware.js` so the global error handler sends a structured HTTP 500.

---

### Requirement 2: Authentication — Merchant Registration (`/auth/merch_reg`)

**User Story:** As a new merchant (UMKM), I want to register both a user account and merchant profile in a single atomic operation, so that my store data is always consistent.

#### Acceptance Criteria

1. WHEN a POST request is made to `/auth/merch_reg` with `{ email, password, fullName, merchantName, latitude, longitude, bankName, bankAccount }`, THE Auth_Controller SHALL call Auth_Service and return HTTP 201 with `{ message, user }` on success.
2. WHEN the request body is missing any of the required fields (`email`, `password`, `fullName`, `merchantName`, `latitude`, `longitude`, `bankName`, `bankAccount`), THE Validator SHALL return HTTP 400 with one descriptive field-level error per missing field before the controller is reached.
3. THE Auth_Service SHALL construct the user data using Prisma camelCase field names `{ email, password: <hash>, fullName, role: "MERCHANT" }` (calling `hash_password()` first) and the merchant data using `{ merchantName, latitude, longitude, bankName, bankAccount }` — `merchantName` not `shop_name`, `password` not `password_hash`.
4. THE Auth_Repository `create_user()` SHALL execute a Prisma `$transaction` that first creates the `User` record and then creates the `Merchant` record; if either insert fails the entire transaction is rolled back and no partial records are persisted.
5. THE Auth_Repository SHALL generate a UUID for `Merchant.userId` using `crypto.randomUUID()` server-side, because `Merchant.userId` is `String @db.Uuid` while `User.id` is `BigInt` — the two are not directly FK-linked.
6. THE Auth_Repository `$transaction` MUST explicitly `return` the created `User` object so the caller receives the object and not `undefined`.
7. WHEN the provided `email` is already registered, THE System SHALL return HTTP 409 with an error message indicating the email conflict.
8. IF the `$transaction` fails for any reason other than a duplicate email, THE System SHALL return HTTP 500 with no partial records committed to the database.
9. IF the Auth_Controller encounters an unhandled rejection, THEN THE Auth_Controller SHALL forward it via `asyncHandler()` from `src/middlewares/error.middleware.js`.

---

### Requirement 3: Authentication — Login (`/auth/login`)

**User Story:** As a registered user, I want to log in with my email and password, so that I receive a JWT to authenticate subsequent requests.

#### Acceptance Criteria

1. WHEN a POST request is made to `/auth/login` with `{ email, password }`, THE Auth_Controller SHALL call the Auth_Service and return HTTP 200 with `{ token }` on success.
2. WHEN the request body is missing `email` or `password`, THE Validator SHALL return HTTP 400 with one descriptive error entry per missing field before the controller is reached.
3. WHEN the provided `email` does not match any `User` record, THE System SHALL return HTTP 401 with message `"Incorrect email or password"`.
4. THE Auth_Service SHALL call `verify_password(plainText, hash)` with `await` using the Prisma field `acc.password` — NOT `acc.password_hash` — so the bcrypt comparison is actually awaited; without `await` the call returns a truthy `Promise` and any password would pass.
5. WHEN `verify_password()` resolves to `false`, THE System SHALL return HTTP 401 with message `"Incorrect email or password"`.
6. THE Auth_Service SHALL build the JWT payload using `acc.fullName` (matching the Prisma `User.fullName` field) — NOT `acc.full_name`.
7. THE JWT SHALL be signed using `generate_token()` from `src/lib/jwt.js` with HS256 algorithm and 15-minute TTL.
8. WHEN a 401 error is thrown inside the Auth_Service, THE Auth_Controller SHALL return HTTP 401 — NOT HTTP 500 — by mapping the `statusCode` property of the thrown error.
9. IF the Auth_Controller encounters an unexpected error without a `statusCode`, THEN THE Auth_Controller SHALL forward it via `asyncHandler()` so the global error handler returns HTTP 500.

---

### Requirement 4: Listing — Create Listing (`POST /listing`)

**User Story:** As a merchant, I want to publish a new surplus food listing with a discounted price, so that customers can discover and purchase my surplus items.

#### Acceptance Criteria

1. WHEN a POST request is made to `/listing` with a valid JWT whose `role` is `"MERCHANT"`, THE Listing_Controller SHALL call the Listing_Service and return HTTP 201 with `{ message, listing }`.
2. WHEN the JWT role is not `"MERCHANT"`, THE RBAC_Middleware SHALL return HTTP 403 before the controller is reached.
3. WHEN the request body is missing `name`, `originalPrice`, `discountPrice`, or `stockTotal`, THE Validator SHALL return HTTP 400 with one error entry per missing or invalid field.
4. WHEN `discountPrice` is greater than or equal to `originalPrice`, or when either price is not a positive finite number, THE Listing_Service SHALL return HTTP 422 with message `"discountPrice must be less than originalPrice"`.
5. WHEN `stockTotal` is not a positive integer (≥ 1), THE Listing_Service SHALL return HTTP 422 with a descriptive error.
6. WHEN the JWT `merchantId` does not resolve to an existing `Merchant` record, THE System SHALL return HTTP 404 before the listing is persisted.
7. THE Listing_Repository `create_listing()` SHALL persist the listing using Prisma camelCase field names `{ name, originalPrice, discountPrice, stockTotal, merchantId }` — NOT snake_case names (`title`, `original_price`, `discount_price`, `stock`, `expired_at`).

---

### Requirement 5: Listing — Read Listings (`GET /listing`, `GET /listing/:id`)

**User Story:** As a customer, I want to browse active listings and view individual listing details, so that I can find and evaluate surplus food near me.

#### Acceptance Criteria

1. WHEN a GET request is made to `/listing` without query parameters, THE Listing_Controller SHALL return HTTP 200 with `{ listings }` containing all listings where `status = "open"` and `deletedAt IS NULL`, ordered by `closeTime ASC`.
2. WHEN a GET request is made to `/listing` with `?lat=<float>&lng=<float>`, THE Listing_Repository SHALL execute the Haversine distance query against the `listings` and `merchants` tables (lowercase mapped names) and return results within a default radius of 10 km ordered by ascending distance.
3. WHEN `?lat=` or `?lng=` is provided but is not a finite number, THE System SHALL return HTTP 400 with a descriptive error before executing any database query.
4. THE Listing_Repository raw SQL MUST filter on `l.status = 'open'` — NOT `'PUBLISHED'` or `'ACTIVE'` — matching the `ListingStatus` Prisma enum value.
5. WHEN a GET request is made to `/listing/:id`, THE Listing_Controller SHALL return HTTP 200 with `{ listing }` including `merchantId`, `merchantName`, `address`, and `latitude`/`longitude` from the related `Merchant` record.
6. IF the listing with the given `:id` does not exist or has `deletedAt IS NOT NULL`, THEN THE System SHALL return HTTP 404.
7. THE Listing_Repository `find_listing_by_id()` SHALL coerce `listingId` to `BigInt` before the Prisma query (`where: { id: BigInt(listingId) }`) because `Listing.id` is `BigInt` in the schema.

---

### Requirement 6: Listing — Update Listing (`PATCH /listing/:id`)

**User Story:** As a merchant, I want to update my existing surplus listing, so that I can adjust pricing, stock, or timing without creating a new listing.

#### Acceptance Criteria

1. WHEN a PATCH request is made to `/listing/:id` with a valid MERCHANT JWT and a partial update body, THE Listing_Controller SHALL call the Listing_Service and return HTTP 200 with `{ message, listing }` containing the updated record.
2. IF the listing with the given `:id` does not exist or has been soft-deleted, THEN THE System SHALL return HTTP 404.
3. IF the JWT `merchantId` does not match the `listing.merchantId`, THEN THE System SHALL return HTTP 403.
4. WHEN `discountPrice` is provided in the update body and is greater than or equal to the effective `originalPrice` (either from the body or the stored value), THE System SHALL return HTTP 422.
5. WHEN `closeTime` is provided in the update body and is not a future timestamp, THE System SHALL return HTTP 422 with a descriptive error.
6. THE Listing_Repository `update_listing()` SHALL use `where: { id: BigInt(listingId), merchantId }` (camelCase, with BigInt coercion) — NOT `{ id: listingId, merchant_id: merchantId }`.

---

### Requirement 7: Listing — Soft-Delete Listing (`DELETE /listing/:id`)

**User Story:** As a merchant, I want to soft-delete a listing I no longer want to offer, so that historical order data referencing the listing is preserved.

#### Acceptance Criteria

1. WHEN a DELETE request is made to `/listing/:id` with a valid MERCHANT JWT, THE Listing_Controller SHALL return HTTP 200 with `{ message: "Listing deleted" }` on success, using `asyncHandler()` to delegate unhandled errors.
2. IF the listing with the given `:id` does not exist or has `deletedAt IS NOT NULL`, THEN THE System SHALL return HTTP 404 before any ownership check.
3. IF the JWT `merchantId` does not match the `listing.merchantId`, THEN THE System SHALL return HTTP 403.
4. THE Listing_Repository `soft_delete_listing()` SHALL execute a Prisma `update()` with `where: { id: BigInt(listingId), merchantId }` and `data: { deletedAt: new Date() }` — it MUST NOT call Prisma `delete()`.

---

### Requirement 8: Order — Create Order with Pessimistic Lock (`POST /order`)

**User Story:** As a customer, I want to place an order for a surplus listing with guaranteed stock reservation, so that I am never double-charged for the last item.

#### Acceptance Criteria

1. WHEN a POST request is made to `/order` with `{ listingId, qty }` and a valid CUSTOMER JWT, THE Order_Controller SHALL call the Order_Service and return HTTP 201 with `{ message, order }`.
2. WHEN the JWT role is not `"CUSTOMER"`, THE RBAC_Middleware SHALL return HTTP 403 — the route MUST call `authorize("CUSTOMER")`, NOT `authorize("CONSUMER")`.
3. THE Order_Repository `create_order_atomic()` SHALL acquire a pessimistic row-level lock via raw SQL `SELECT ... FROM listings WHERE id = $1 FOR UPDATE` inside a Serializable Prisma transaction, using the lowercase mapped table name `listings` — NOT `"Listing"`.
4. WHEN the locked listing has `status != "open"` (compared against the lowercase `ListingStatus` value `"open"`, NOT `"PUBLISHED"`), THE System SHALL return HTTP 409 with a descriptive error.
5. WHEN `listing.stock_total < qty`, THE System SHALL return HTTP 409 with the message indicating remaining stock count.
6. THE Order_Repository SHALL decrement `listings.stock_total` by `qty` using raw SQL on the `listings` table within the same transaction.
7. THE Order_Repository `tx.order.create()` data block MUST use Prisma camelCase fields `{ customerId, listingId, merchantId, qty, totalAmount, qrToken, status: "pending_payment" }` — NOT snake_case variants (`user_id`, `listing_id`, `qr_token`).
8. THE `merchantId` in the order create data MUST be populated from the locked listing row's `merchant_id` column — it is a non-nullable FK in the schema.
9. THE QR_Token MUST be generated via `crypto.randomBytes(32).toString('hex')` server-side within the transaction before the order record is created (ADR-005).
10. THE transaction MUST run at `isolationLevel: "Serializable"` with `maxWait: 5000` ms and `timeout: 10000` ms.

---

### Requirement 9: Order — QR Verification / Pickup Confirmation (`POST /order/:id/verify`)

**User Story:** As a merchant, I want to scan a customer's QR code at pickup, so that the order is marked completed and the closed-loop is achieved.

#### Acceptance Criteria

1. WHEN a POST request is made to `/order/:id/verify` with `{ qrPayload }` and a valid MERCHANT JWT, THE Order_Controller SHALL call the Order_Service and return HTTP 200 with `{ message, order }`.
2. WHEN the JWT role is not `"MERCHANT"`, THE RBAC_Middleware SHALL return HTTP 403.
3. WHEN the `qrPayload` field is absent or empty in the request body, THE Validator SHALL return HTTP 400 before the controller is reached.
4. IF the order with the given `:id` does not exist, THEN THE System SHALL return HTTP 404.
5. IF the JWT `merchantId` does not match `order.merchantId`, THEN THE System SHALL return HTTP 403 — any authenticated merchant MUST NOT be able to complete orders belonging to other merchants.
6. WHEN the order `status` is not `"paid"`, THE System SHALL return HTTP 409 with a message indicating the current status prevents verification.
7. WHEN the provided `qrPayload` does not match `order.qrToken` (using constant-time comparison), THE System SHALL return HTTP 400.
8. WHEN both ownership and QR token checks pass, THE Order_Repository SHALL update the order to `status: "completed"` (lowercase `OrderStatus` value) and THE Order_Service SHALL emit the `order:completed` domain event.
9. THE route `POST /order/:id/verify` MUST be registered under `authenticate` + `authorize("MERCHANT")` guards.

---

### Requirement 10: Order — Cancel Order (`PATCH /order/:id/cancel`)

**User Story:** As a customer or admin, I want to cancel an order before it is completed, so that reserved stock is released and other customers can purchase.

#### Acceptance Criteria

1. WHEN a PATCH request is made to `/order/:id/cancel` without a valid JWT, THE System SHALL return HTTP 401.
2. IF the order with the given `:id` does not exist, THEN THE System SHALL return HTTP 404.
3. IF the requesting user's role is `"CUSTOMER"` and their `id` does not match `order.customerId`, THEN THE System SHALL return HTTP 403.
4. IF the requesting user's role is `"ADMIN"`, THEN THE System SHALL allow the cancellation regardless of ownership (FR-A-03).
5. WHEN the order `status` is `"completed"` or `"cancelled"`, THE System SHALL return HTTP 409 — only orders with status `"pending_payment"` or `"paid"` may be cancelled.
6. WHEN cancellation is permitted, THE System SHALL atomically update the order to `status: "cancelled"` (lowercase) AND increment `listings.stock_total` by `order.qty` in a single Prisma transaction, using the lowercase mapped table name `listings`.
7. THE Order_Service role check MUST compare against `"ADMIN"` and `"CUSTOMER"` (Prisma `Role` enum values) — NOT `"CONSUMER"`.

---

### Requirement 11: Order — Get Orders

**User Story:** As a customer, I want to view all my orders and individual order details, so that I can track my purchases and access QR codes.

#### Acceptance Criteria

1. WHEN a GET request is made to `/order` without a valid CUSTOMER JWT, THE System SHALL return HTTP 401.
2. WHEN a GET request is made to `/order` with a valid CUSTOMER JWT, THE System SHALL return HTTP 200 with `{ orders }` containing only the orders belonging to the authenticated customer, ordered by `createdAt DESC`.
3. WHEN a GET request is made to `/order/:id` with a valid JWT, THE System SHALL return HTTP 200 with `{ order }` including related listing title, discountPrice, and payment `pgStatus`.
4. IF the order with the given `:id` does not exist, THEN THE System SHALL return HTTP 404.
5. IF the requesting user's role is `"CUSTOMER"` and their `id` does not match `order.customerId`, THEN THE System SHALL return HTTP 403.
6. IF the requesting user's role is `"ADMIN"`, THEN THE System SHALL return the order regardless of `customerId`.
7. THE Order_Repository `find_order_by_id()` SHALL use the Prisma relation name `listing` in its `include` block — NOT `list` (which is not a defined relation in the schema).

---

### Requirement 12: Midtrans Webhook Handler (`POST /order/webhook/midtrans`)

**User Story:** As the System, I want to receive and verify Midtrans payment gateway callbacks, so that orders are automatically transitioned to `paid` status upon successful payment.

#### Acceptance Criteria

1. WHEN a POST request is received at `/order/webhook/midtrans`, THE System SHALL validate that `order_id`, `status_code`, `gross_amount`, and `signature_key` are all present in the body; if any are missing THE System SHALL return HTTP 400.
2. THE System SHALL verify the Midtrans signature by computing `SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)` and comparing it against `signature_key` using a constant-time comparison (Node.js `crypto.timingSafeEqual`).
3. WHEN the computed signature does not match `signature_key`, THE System SHALL return HTTP 403 with `{ error: "Invalid signature" }` and take no further action.
4. WHEN the `transaction_status` is `"settlement"` or `"capture"` AND the order with `order_id` exists AND its current `status` is `"pending_payment"`, THE System SHALL transition the order to `status: "paid"` and return HTTP 200.
5. WHEN the `transaction_status` is `"expire"` or `"cancel"` AND the order exists AND its current `status` is `"pending_payment"`, THE System SHALL transition the order to `status: "cancelled"` and restore `listings.stock_total` by `order.qty`, then return HTTP 200.
6. IF the order with `order_id` does not exist, THEN THE System SHALL return HTTP 404 for both settlement and cancellation paths.
7. IF the order `status` is already `"paid"` when a duplicate `settlement` callback arrives, THEN THE System SHALL return HTTP 200 without re-processing (idempotency — NFR-4).
8. IF the order `status` is already `"cancelled"` when a duplicate `expire`/`cancel` callback arrives, THEN THE System SHALL return HTTP 200 without re-processing.
9. IF a `settlement` callback arrives for an order that is not in `"pending_payment"` status (e.g., already `"cancelled"`), THEN THE System SHALL return HTTP 409.
10. THE webhook route MUST NOT require JWT authentication — it is called by Midtrans, not by a user.

---

### Requirement 13: Order Timeout Cron Job (`orderTimeout.job.js`)

**User Story:** As the System, I want to automatically cancel orders that have been in `pending_payment` status for more than 15 minutes, so that reserved stock is released for other customers.

#### Acceptance Criteria

1. THE Timeout_Job SHALL execute on a schedule that fires every minute (consistent with `node-cron` schedule `"* * * * *"`).
2. WHEN the job fires, THE System SHALL query all `Order` records where `status = "pending_payment"` AND `createdAt < (NOW() - 15 minutes)`.
3. THE System SHALL atomically update each expired order's `status` to `"cancelled"` AND increment `listings.stock_total` by `order.qty` in a single Prisma transaction per order.
4. THE System SHALL also update any associated `Payment` records for the expired order to `pgStatus: "cancel"` within the same transaction, because the `Order` model has a `payments` relation and dangling `pending` payments are a data integrity violation.
5. WHEN no expired orders are found, THE System SHALL complete the job run without any database writes.
6. IF a database error occurs while cancelling a specific order, THE System SHALL log the error with the `order.id` and continue processing the remaining expired orders — a single order failure MUST NOT crash the entire job run.

---

### Requirement 14: Request Validation — Listing Validators

**User Story:** As the System, I want to validate all incoming listing requests, so that invalid data never reaches the service layer and returns clear, actionable error messages.

#### Acceptance Criteria

1. WHEN a POST request is made to `/listing` and `name` is absent or an empty string, THE Validator SHALL return HTTP 400 with `{ errors: [{ field: "name", message: "..." }] }` before reaching the controller.
2. WHEN `originalPrice` or `discountPrice` is absent, not a number, negative, or zero, THE Validator SHALL return HTTP 400 with one error entry per invalid field.
3. WHEN `stockTotal` is absent, not an integer, or less than 1, THE Validator SHALL return HTTP 400 with `{ errors: [{ field: "stockTotal", message: "..." }] }`.
4. WHEN a PATCH request is made to `/listing/:id`, THE Validator SHALL only validate fields that are actually present in the body — absent fields SHALL NOT produce validation errors (partial update semantics).
5. WHEN multiple fields are invalid simultaneously, THE Validator SHALL collect all errors into a single `{ errors: [...] }` response with one entry per field — it MUST NOT short-circuit after the first failure.

---

### Requirement 15: Request Validation — Order Validators

**User Story:** As the System, I want to validate all incoming order requests, so that malformed data is rejected early with clear error messages.

#### Acceptance Criteria

1. IF `listingId` is absent, not a string or integer coercible to a positive `BigInt`, or less than 1, THEN THE Validator for `POST /order` SHALL return HTTP 400 with `{ errors: [{ field: "listingId", message: "..." }] }`.
2. IF `qty` is absent, not an integer, less than 1, or greater than 9999, THEN THE Validator for `POST /order` SHALL return HTTP 400 with `{ errors: [{ field: "qty", message: "..." }] }`.
3. IF `qrPayload` is absent, empty, or not a 64-character lowercase hexadecimal string (`/^[a-f0-9]{64}$/`), THEN THE Validator for `POST /order/:id/verify` SHALL return HTTP 400 with `{ errors: [{ field: "qrPayload", message: "..." }] }`.
4. WHEN multiple fields are invalid simultaneously, THE Validator SHALL collect all errors into a single HTTP 400 response with one entry per invalid field before the controller is reached.

---

### Requirement 16: Change History Logging (`ai_backend-core_history.md`)

**User Story:** As a developer reviewing this codebase, I want every endpoint, route, controller, and repository change to be recorded in a history file, so that I can trace the evolution of the API without reading every git commit.

#### Acceptance Criteria

1. WHEN any implementation session modifies or creates any `src/` file (controller, service, repository, route, middleware, validator, job, or lib), THE System SHALL append one dated entry per session to `ai_backend-core_history.md` in the format: `## [YYYY-MM-DD] <Module> — <Change Title>`.
2. EACH history entry SHALL include: the ISO 8601 date, the list of files changed, a prose summary of what was added or fixed, and the type tag (`[BUG FIX]` or `[NEW FEATURE]`).
3. THE History_File SHALL explicitly document all bug fixes from Requirements 1–15, including: missing `await` on `verify_password`, wrong field names (`password_hash` → `password`, `full_name` → `fullName`, `shop_name` → `merchantName`, `user_id` → `customerId`), wrong enum values (`"PUBLISHED"` → `"open"`, `"CONSUMER"` → `"CUSTOMER"`, `"CANCELLED"` → `"cancelled"`), missing `return` in transaction, and wrong relation name (`list` → `listing`).
4. THE History_File MUST be non-empty by the end of the implementation session and MUST remain append-only — existing entries MUST NOT be deleted or rewritten.
5. IF writing to the History_File fails for any reason, THE System SHALL log the failure to stdout but MUST NOT abort the API request being processed.

---

### Requirement 17: Inline Code Documentation

**User Story:** As a developer maintaining this codebase, I want every function to have an inline explanatory comment, so that I can understand the intent without external documentation.

#### Acceptance Criteria

1. EVERY exported function in every `src/repositories/`, `src/services/`, `src/controllers/`, `src/lib/`, `src/events/`, and `src/jobs/` file SHALL have a JSDoc block (`/** ... */`) directly above it that states: the function's business purpose, each `@param` with its type and meaning, and the `@returns` type and shape.
2. EVERY SQL query block, Prisma transaction block, `crypto` call, and enum comparison MUST have an inline comment (`//`) on the line immediately before or after explaining its purpose and any non-obvious rationale.
3. WHEN a bug is fixed in a file, THE inline comment at the corrected line MUST explicitly state: (a) what the previous code did wrong, (b) what the corrected code does, and (c) why the original was incorrect — so future developers can trace the fix without reading git history.
