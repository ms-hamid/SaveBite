/*
  Warnings:

  - You are about to drop the column `user_id` on the `Merchant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Merchant" DROP CONSTRAINT "Merchant_user_id_fkey";

-- DropIndex
DROP INDEX "Merchant_user_id_key";

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "user_id";

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
