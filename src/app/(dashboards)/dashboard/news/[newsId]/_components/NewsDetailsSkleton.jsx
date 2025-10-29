const NewsDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-[800px] m-auto p-[25px] xl:p-[40px] h-full rounded-[4px] bg-white border border-[#DFDFE4]">
      <div className="mx-auto mb-6 flex justify-center">
        <div className="skeleton-box w-[260px] h-[260px] rounded-lg"></div>
      </div>
      <div className="px-3 pb-4 space-y-4">
        <div className="skeleton-box h-8 w-3/4 rounded-lg"></div>
        <div className="skeleton-box h-4 w-1/4 rounded-lg"></div>
        <div className="skeleton-box h-6 w-24 rounded-lg"></div>
        <div className="skeleton-box h-4 w-full rounded-lg"></div>
        <div className="skeleton-box h-4 w-5/6 rounded-lg"></div>
        <div className="skeleton-box h-6 w-28 rounded-lg"></div>
        <div className="skeleton-box h-4 w-full rounded-lg"></div>
        <div className="skeleton-box h-4 w-11/12 rounded-lg"></div>
        <div className="skeleton-box h-4 w-2/3 rounded-lg"></div>
        <div className="skeleton-box h-5 w-20 rounded-lg"></div>
      </div>
    </div>
  );
};

export default NewsDetailsSkeleton;
