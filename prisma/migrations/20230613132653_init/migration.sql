/*
  Warnings:

  - A unique constraint covering the columns `[shortUrlId]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Url_shortUrlId_key" ON "Url"("shortUrlId");
