-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Masculino', 'Femenino');

-- CreateEnum
CREATE TYPE "Feature" AS ENUM ('LOAN', 'CREDIT_CARD');

-- CreateEnum
CREATE TYPE "BiometricsStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SignatureStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
    "firstName" TEXT,
    "lastName" TEXT,
    "nationalId" TEXT,
    "gender" "Gender",
    "email" TEXT,
    "phone" TEXT,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "zipCode" TEXT,
    "street" TEXT,
    "streetNumber" INTEGER,
    "apartment" TEXT,
    "employmentStatus" TEXT,
    "creditPurpose" TEXT,
    "proofOfIncomeBase64" TEXT,
    "proofOfAddressBase64" TEXT,
    "amount" DOUBLE PRECISION,
    "installments" DOUBLE PRECISION,
    "biometricsVerificationId" TEXT,
    "signatureId" TEXT,
    "biometricsStatus" "BiometricsStatus" NOT NULL DEFAULT 'PENDING',
    "signatureStatus" "SignatureStatus" NOT NULL DEFAULT 'PENDING',
    "requestedFeature" "Feature" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
