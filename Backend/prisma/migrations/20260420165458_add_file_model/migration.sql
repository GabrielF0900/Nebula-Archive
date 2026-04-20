/*
 Warnings:
 
 - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- CreateTable
CREATE TABLE "File" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "fileKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "userId" INTEGER NOT NULL,
  "thumbnailUrl" TEXT,
  "downloadUrl" TEXT,
  "errorMessage" TEXT,
  "duration" INTEGER,
  "width" INTEGER,
  "height" INTEGER,
  "codec" TEXT,
  "bitrate" INTEGER,
  "format" TEXT,
  "colorSpace" TEXT,
  "frameRate" DOUBLE PRECISION,
  "edgeLocation" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "File_fileKey_key" ON "File"("fileKey");
-- AddForeignKey
ALTER TABLE "File"
ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;