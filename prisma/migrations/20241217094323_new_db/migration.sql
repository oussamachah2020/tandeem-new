/*
  Warnings:

  - Made the column `fcmToken` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "fcmToken" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "resetToken" TEXT;
