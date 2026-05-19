import { demoSourceReviewItems, officialSources, sourceDocuments } from "../seed";

export const getOfficialSources = () => officialSources;

export const getSourceDocuments = () => sourceDocuments;

export const getSourceReviewItems = () => demoSourceReviewItems;

export const getSourceReviewSummary = () => {
  const total = demoSourceReviewItems.length;
  const highPriority = demoSourceReviewItems.filter((item) => item.priority === "high").length;
  const toConnect = demoSourceReviewItems.filter((item) => item.status === "to_connect").length;
  const verified = demoSourceReviewItems.filter((item) => item.status === "verified").length;
  const needsHumanReview = demoSourceReviewItems.filter(
    (item) => item.status === "needs_human_review",
  ).length;

  return {
    total,
    highPriority,
    toConnect,
    verified,
    needsHumanReview,
  };
};
