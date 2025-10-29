"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

const CompanyList = ({
  handleFollow,
  matchedSymbols,
  displayedTickers,
  isLoading,
  loaderRef,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wishListUrl = searchParams.get("followed");
  
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickers = useMemo(() => {
  if (!searchQuery.trim()) return displayedTickers;
  
  const query = searchQuery.toLowerCase();
  return displayedTickers.filter((ticker) =>
    ticker.companyName?.toLowerCase().includes(query) ||
    ticker.symbol?.toLowerCase().includes(query)
  );
}, [searchQuery, displayedTickers]);
  
  const handleClick = useCallback(() => {
    if (matchedSymbols.length >= 5) {
      window.location.href = "/dashboard";
    }
  }, [matchedSymbols, router]);

  return (
    <>
      <div className="w-full h-full flex justify-between flex-col xl:flex-row items-start xl:items-center mb-[30px] gap-[20px]">
        <div className="">
          {pathname && wishListUrl ? (
            <p className="text-[#555] text-[18px] leading-[1.6] tracking-normal xl:tracking-[-0.48px] mb-0">
              All Companies
            </p>
          ) : matchedSymbols.length >= 5 ? (
            <p className="text-[#070707] text-[18px] font-medium leading-[1.6] tracking-normal xl:tracking-[-0.48px] mb-0">
              🎉 You’re all set! Proceed to your dashboard for personalized
              updates
            </p>
          ) : (
            <p className="text-[#555] text-[16px] leading-[1.6] tracking-normal xl:tracking-[-0.48px] mb-0">
              Follow at least{" "}
              {matchedSymbols.length === 0
                ? "5"
                : `${Math.max(0, 5 - matchedSymbols.length)} more`}{" "}
              companies to get personalized financial updates
            </p>
          )}
        </div>
        <label className="bg-[#fff] border-[0.25px] border-[#d3d3d3] rounded-[4px] input w-full max-w-[238px] shadow-none  ">
        <input
         type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="placeholder-[#555555] placeholder:text-[12px] leading-[1.5] tracking-normal xl:tracking-[-0.24px] w-full px-[10px] py-[8px] outline-none border-0"
        />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M9.82633 8.98848L7.90442 7.06657C8.48689 6.30406 8.80634 5.37918 8.80647 4.40323C8.80647 3.22712 8.34841 2.12132 7.51663 1.28969C6.68501 0.458061 5.57935 0 4.40309 0C3.22697 0 2.12117 0.458061 1.28955 1.28969C-0.427244 3.00662 -0.427244 5.80013 1.28955 7.51678C2.12117 8.34855 3.22697 8.80661 4.40309 8.80661C5.37904 8.80649 6.30391 8.48703 7.06642 7.90456L8.98833 9.82647C9.10393 9.94222 9.2557 10.0001 9.40733 10.0001C9.55896 10.0001 9.71073 9.94222 9.82633 9.82647C10.0578 9.59513 10.0578 9.21982 9.82633 8.98848ZM2.12754 6.67878C0.872863 5.42411 0.873008 3.38251 2.12754 2.12769C2.73535 1.52002 3.54354 1.18523 4.40309 1.18523C5.26279 1.18523 6.07083 1.52002 6.67864 2.12769C7.28645 2.73549 7.62124 3.54368 7.62124 4.40323C7.62124 5.26293 7.28645 6.07098 6.67864 6.67878C6.07083 7.28659 5.26279 7.62138 4.40309 7.62138C3.54354 7.62138 2.73535 7.28659 2.12754 6.67878Z"
              fill="#555555"
            />
          </svg>
        </label>
      </div>
      <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-[13px]">
        {filteredTickers?.map((ticker, index) => {
          const { companyName, image } = ticker;

          return (
            <div
              key={index}
              className="flex items-center justify-between px-[20px] py-[11px] bg-[#F7F0E8] rounded-[5px] border-[0.75px] border-[rgba(215, 215, 215, 0.63)]"
            >
              <div className="company flex gap-[14px] items-center">
                <div className="w-full max-w-[40px] h-[40px] rounded-full">
                  <img
                    className="w-full rounded-full h-full object-contain object-center"
                    src={
                      image || "/assets/images/dashboard-company/demoIcon.svg"
                    }
                    alt={companyName}
                  />
                </div>
                <div className="text-[#070707] text-[16px] font-medium leading-normal tracking-normal xl:tracking-[-0.48px]">
                  {companyName || "Example"}
                </div>
              </div>
              <button
                onClick={() => handleFollow(ticker)}
                className={`px-[10px] py-[4px] rounded-[34px] text-[14px] leading-[1.5] tracking-[-0.42px] border-[1px]
                  ${
                    matchedSymbols.includes(ticker.symbol)
                      ? "bg-[#69FB7F] text-[#070707] border-0"
                      : "bg-white text-[#070707] border-[#000]"
                  }`}
              >
                {matchedSymbols.includes(ticker.symbol)
                  ? "Following"
                  : "Follow"}
              </button>
            </div>
          );
        })}

        <div
          ref={loaderRef}
          className="h-12 col-span-full flex justify-center items-center"
        >
          <div
            ref={loaderRef}
            className="h-12 col-span-full flex justify-center items-center"
          >
            {isLoading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
              </div>
            )}
          </div>
        </div>
        {wishListUrl && pathname ? (
          <>
            <div className="mt-[35px] flex justify-end fixed right-[5%] bottom-[2%]">
              <a
                href="/dashboard"
                className="w-full max-w-[300px] btn rounded-[4px] grid grid-cols-[auto_8px] gap-[5px] items-center px-[20px] py-[0] bg-[#070707] text-[#F1F4F2]"
              >
                <span className="text-[14px] text-[#F1F4F2] tracking-normal xl:tracking-[-0.42px]">
                  Go Back To Dashboard
                </span>
                <span className="w-full inline-flex items-center"></span>
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="mt-[35px] flex justify-end fixed right-[5%] bottom-[2%]">
              <button
                type="button"
                onClick={handleClick}
                disabled={matchedSymbols.length < 5}
                className={`w-full max-w-[180px] btn rounded-[4px] grid grid-cols-[auto_8px] gap-[5px] items-center px-[20px] py-[0]
          ${
            matchedSymbols.length < 5
              ? "!bg-gray-400 !text-gray-500 cursor-not-allowed"
              : "bg-[#070707] text-[#F1F4F2] hover:bg-[#2a2a2a] transition-colors"
          }`}
              >
                <span className="text-[14px] text-[#F1F4F2] tracking-normal xl:tracking-[-0.42px]">
                  Get Started
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CompanyList;
