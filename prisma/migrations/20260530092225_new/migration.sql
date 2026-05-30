-- CreateTable
CREATE TABLE "CounselorThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CounselorThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounselorMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounselorMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CounselorThread_userId_key" ON "CounselorThread"("userId");

-- CreateIndex
CREATE INDEX "CounselorThread_userId_updatedAt_idx" ON "CounselorThread"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "CounselorMessage_threadId_createdAt_idx" ON "CounselorMessage"("threadId", "createdAt");

-- AddForeignKey
ALTER TABLE "CounselorThread" ADD CONSTRAINT "CounselorThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounselorMessage" ADD CONSTRAINT "CounselorMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "CounselorThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
