-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isUpVotesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "disableFeedback" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackTypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "upVotes" INTEGER NOT NULL DEFAULT 0,
    "downVotes" INTEGER NOT NULL DEFAULT 0,
    "feedbackerInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_publicId_key" ON "Project"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackTypes_id_key" ON "FeedbackTypes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Feedbacks_id_key" ON "Feedbacks"("id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackTypes" ADD CONSTRAINT "FeedbackTypes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FeedbackTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
