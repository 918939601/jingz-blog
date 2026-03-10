-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('BLOG', 'NOTE');

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "id" SERIAL NOT NULL,
    "tagName" VARCHAR(20) NOT NULL,
    "tagType" "TagType" NOT NULL DEFAULT 'BLOG',

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteTag" (
    "id" SERIAL NOT NULL,
    "tagName" VARCHAR(20) NOT NULL,
    "tagType" "TagType" NOT NULL DEFAULT 'NOTE',

    CONSTRAINT "NoteTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Echo" (
    "id" SERIAL NOT NULL,
    "reference" VARCHAR(20) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "content" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Echo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToBlogTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlogToBlogTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoteToNoteTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NoteToNoteTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogTag_tagName_key" ON "BlogTag"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "NoteTag_tagName_key" ON "NoteTag"("tagName");

-- CreateIndex
CREATE INDEX "_BlogToBlogTag_B_index" ON "_BlogToBlogTag"("B");

-- CreateIndex
CREATE INDEX "_NoteToNoteTag_B_index" ON "_NoteToNoteTag"("B");

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToNoteTag" ADD CONSTRAINT "_NoteToNoteTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoteToNoteTag" ADD CONSTRAINT "_NoteToNoteTag_B_fkey" FOREIGN KEY ("B") REFERENCES "NoteTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
