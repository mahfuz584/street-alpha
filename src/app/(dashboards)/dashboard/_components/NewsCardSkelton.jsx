const NewsCardSkeleton = () => {
  return (
    <div className="rounded-sm bg-[#fff] border-[0.75px] border-[#DFDFE4]">
      <div className="skeleton-box h-[270px] w-full"></div>
      <div className="px-4 mt-5">
        <div className="skeleton-box h-6 w-3/4 mb-3 rounded-lg"></div>
        <div className="skeleton-box h-4 w-full mb-2 rounded-lg"></div>
        <div className="skeleton-box h-4 w-5/6 rounded-lg mb-4"></div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
