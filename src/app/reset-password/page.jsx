import { Suspense } from "react";
import ResetPassWrapper from "./_components/ResetPassWrapper";
import ResetPasswordSkeleton from "./_components/ResetPasswordSkeleton";

const ResetPasswordPage = async ({ searchParams }) => {
  const searcPramsPromise = searchParams;
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPassWrapper searchParams={searcPramsPromise} />
    </Suspense>
  );
};

export default ResetPasswordPage;
