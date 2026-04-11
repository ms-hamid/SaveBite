-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CONSUMER', 'MERCHANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "KYC_Status" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "List_Status" AS ENUM ('PUBLISHED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Withdraw_Status" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Order_Status" AS ENUM ('PENDING_PAYMENT', 'PAID_RESERVED', 'COMPLETED', 'EXPIRED_UNCLAIMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CONSUMER',
    "strike_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" UUID NOT NULL,
    "shop_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "virtual_balance" DECIMAL(15,2) NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_account" TEXT NOT NULL,
    "kyc_status" "KYC_Status" NOT NULL DEFAULT 'PENDING',
    "user_id" UUID NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" UUID NOT NULL,
    "merchant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "original_price" DECIMAL(15,2) NOT NULL,
    "discount_price" DECIMAL(15,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "status" "List_Status" NOT NULL DEFAULT 'PUBLISHED',
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "qr_token" TEXT NOT NULL,
    "status" "Order_Status" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" UUID NOT NULL,
    "merchant_id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "Withdraw_Status" NOT NULL DEFAULT 'PENDING',
    "proof_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "midtrans_trx_id" TEXT NOT NULL,
    "payment_type" TEXT NOT NULL,
    "pg_status" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_user_id_key" ON "Merchant"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_midtrans_trx_id_key" ON "Payment"("midtrans_trx_id");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
