/*
  Warnings:

  - You are about to drop the column `shortUrlId` on the `Url` table. All the data in the column will be lost.
  - Added the required column `shortUrl` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortUrlId",
ADD COLUMN     "shortUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UrlClick" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlClick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlClick" ADD CONSTRAINT "UrlClick_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
