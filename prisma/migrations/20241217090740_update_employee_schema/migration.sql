/*
  Warnings:

  - You are about to drop the column `userId` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiresAt` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_userId_fkey";

-- DropIndex
DROP INDEX "employee_userId_key";

-- DropIndex
DROP INDEX "user_resetToken_key";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "userId",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';

-- AlterTable
ALTER TABLE "offer" ADD COLUMN     "latitude" BIGINT,
ADD COLUMN     "longitude" BIGINT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiresAt";
