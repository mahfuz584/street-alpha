const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-10 max-w-lg bg-gray-200 rounded-lg"></div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-20 bg-gray-200 rounded-lg skeleton-box"></div>
        <div className="h-10 w-20 bg-gray-200 rounded-lg skeleton-box"></div>
        <div className="h-10 w-20 bg-gray-200 rounded-lg skeleton-box"></div>
      </div>
      <div className="max-w-full h-96 bg-gray-200 rounded-lg skeleton-box"></div>
    </div>
  );
};

export default DashboardSkeleton;
