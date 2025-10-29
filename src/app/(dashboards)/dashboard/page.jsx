import { Suspense } from "react";
import DashboardSkeleton from "./_components/DashboardSkeleton";
import DashboardWrapper from "./_components/DashboardWrapper";

const DashboardPage = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardWrapper />
    </Suspense>
  );
};

export default DashboardPage;
