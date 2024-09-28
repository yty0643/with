/*
  Warnings:

  - You are about to drop the `SMSAuthenticationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SMSAuthenticationCode";

-- CreateTable
CREATE TABLE "SMSAuthCode" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SMSAuthCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SMSAuthCode_phoneNumber_key" ON "SMSAuthCode"("phoneNumber");
