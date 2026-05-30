-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'DEEMED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT');

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" "CollegeType" NOT NULL,
    "category" TEXT NOT NULL,
    "naacGrade" TEXT,
    "nirfRank" INTEGER,
    "establishedYear" INTEGER,
    "description" TEXT,
    "imageUrl" TEXT,
    "websiteUrl" TEXT,
    "feesMin" INTEGER NOT NULL,
    "feesMax" INTEGER NOT NULL,
    "avgPackageLpa" DOUBLE PRECISION,
    "maxPackageLpa" DOUBLE PRECISION,
    "placementRate" DOUBLE PRECISION,
    "overallRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "durationYrs" INTEGER NOT NULL,
    "feesPerYear" INTEGER NOT NULL,
    "seats" INTEGER,
    "cutoffJeeMain" INTEGER,
    "cutoffJeeAdv" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementStat" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "avgPackageLpa" DOUBLE PRECISION NOT NULL,
    "maxPackageLpa" DOUBLE PRECISION NOT NULL,
    "medianPackageLpa" DOUBLE PRECISION,
    "placedStudents" INTEGER NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "topRecruiters" TEXT[],

    CONSTRAINT "PlacementStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeFacility" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CollegeFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "pros" TEXT,
    "cons" TEXT,
    "batch" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE INDEX "College_state_city_idx" ON "College"("state", "city");

-- CreateIndex
CREATE INDEX "College_type_idx" ON "College"("type");

-- CreateIndex
CREATE INDEX "College_nirfRank_idx" ON "College"("nirfRank");

-- CreateIndex
CREATE INDEX "College_feesMin_feesMax_idx" ON "College"("feesMin", "feesMax");

-- CreateIndex
CREATE INDEX "College_overallRating_idx" ON "College"("overallRating");

-- CreateIndex
CREATE INDEX "College_name_city_state_idx" ON "College"("name", "city", "state");

-- CreateIndex
CREATE INDEX "Course_collegeId_idx" ON "Course"("collegeId");

-- CreateIndex
CREATE INDEX "Course_branch_idx" ON "Course"("branch");

-- CreateIndex
CREATE INDEX "PlacementStat_collegeId_year_idx" ON "PlacementStat"("collegeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavedItem_userId_collegeId_key" ON "SavedItem"("userId", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlacementStat" ADD CONSTRAINT "PlacementStat_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeFacility" ADD CONSTRAINT "CollegeFacility_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
