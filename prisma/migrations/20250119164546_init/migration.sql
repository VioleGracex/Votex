-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "votePageId" INTEGER;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "votePageId" INTEGER;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_votePageId_fkey" FOREIGN KEY ("votePageId") REFERENCES "VotePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_votePageId_fkey" FOREIGN KEY ("votePageId") REFERENCES "VotePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
