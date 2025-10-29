import { Suspense } from "react";
import NewsDetailsSkeleton from "./_components/NewsDetailsSkleton";
import NewsDetailsWrapper from "./_components/NewsDetailsWrapper";

const NewsDetailsPage = async ({ params }) => {
  return (
    <Suspense fallback={<NewsDetailsSkeleton />}>
      <NewsDetailsWrapper params={params} />
    </Suspense>
  );
};

export default NewsDetailsPage;
