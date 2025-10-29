"use client";
import { useFollowingData } from "@/app/hooks/useFollowing";
import { tableData } from "@/pageData/tableData";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PAGE_SIZE = 20;
const Wishlist = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const { data: session } = useSession();
  const user = session?.user;
  const { matchedSymbols, setMatchedSymbols } = useFollowingData();
  const [wishList, setWishList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalPages = Math.ceil(matchedSymbols.length / PAGE_SIZE);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // console.log("symbols", matchedSymbols);

  const start = pageIndex * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const currentSymbols = matchedSymbols.slice(start, end);

  useEffect(() => {
    const fetchWishList = async () => {
      if (!currentSymbols || currentSymbols.length === 0) return;
      try {
        const response = await axios.post("/api/wishlist", currentSymbols);
        setWishList(response.data.watchlist || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishList();
  }, [matchedSymbols, pageIndex]);

  //data sorting
  const sortedWishList = [...wishList].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0; // No sorting

    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }
  });
  //handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  //remove from wishlist
  const handleRemoveWishList = async (symbol) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/unfollow`,
        { symbol },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (response.data) {
        setMatchedSymbols((prev) => prev.filter((s) => s !== symbol));
        setWishList((prev) => prev.filter((item) => item.symbol !== symbol));
        toast.success(`Removed ${symbol} from your watchlist`, {
          position: "top-center",
          className: "center-toast",
        });
      }
    } catch (error) {
      console.log("Error unfollowing company:", error);
      toast.error("Failed to remove from watchlist");
    }
  };
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
        </div>
      ) : wishList.length === 0 ? (
        <div>No data found</div>
      ) : (
        <section className="wish-list-container">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Company Name and Symbol</th>
                  <th>
                    <TableHeadData
                      data="Last Price"
                      sortKey="last_price"
                      onClick={() => handleSort("last_price")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <TableHeadData
                      data="AI Forecast"
                      sortKey="ai_forecast"
                      onClick={() => handleSort("ai_forecast")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <TableHeadData
                      data="Fair Value"
                      sortKey="fair_value"
                      onClick={() => handleSort("fair_value")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <TableHeadData
                      data="1Y Return"
                      sortKey="one_year_return"
                      onClick={() => handleSort("one_year_return")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <TableHeadData
                      data="ROIC"
                      sortKey="roic"
                      onClick={() => handleSort("roic")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <TableHeadData
                      data="PE"
                      sortKey="pe_ratio"
                      onClick={() => handleSort("pe_ratio")}
                      sortState={sortConfig}
                    />
                  </th>
                  <th>
                    <Link
                      href="/dashboard/add-company-list?followed=true"
                      className="btn rounded-[34px] bg-[#070707] font-[400] text-[14px] leading-normal tracking-normal xl:tracking-[-0.42px] text-[#F1F4F2] border-0 shadow-none"
                    >
                      Add Company
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedWishList?.map((tdData, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle rounded-full h-8 w-8 2xl:h-10 2xl:w-10">
                              <img
                                className="w-full h-full object-cover object-center"
                                src={
                                  tdData?.image ||
                                  "/assets/images/dashboard-company/demoIcon.svg"
                                }
                                alt={tdData?.company_name}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-[6px]">
                            <div className="text-[#070707] text-[14px] font-medium tracking-normal xl:tracking-[-0.42px]">
                              {tdData?.symbol}
                            </div>
                            <div className="text-[#555] text-[12px] leading-normal tracking-normal xl:tracking-[-0.24px]">
                              {tdData?.company_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>${tdData?.last_price}</td>
                      <td>
                        <div
                          className={`flex items-center justify-center rounded-[34px] text-center font-[400] w-full max-w-fit  text-[14px] text-[#070707] leading-normal tracking-normal xl:tracking-[-0.42px] px-[10px] py-[3px] 
                          ${
                            (tdData.ai_forecast == "Positive" &&
                              "bg-[#5CFEA0] ") ||
                            (tdData?.ai_forecast == "Negative" &&
                              "bg-[#F54848] text-[#F1F4F2]") ||
                            (tdData?.ai_forecast == "Neutral" && "bg-[#CFE3E5]")
                          }
                          `}
                        >
                          {tdData?.ai_forecast}
                        </div>
                      </td>
                      <td>${tdData?.fair_value}</td>
                      <td>{tdData?.one_year_return}%</td>
                      <td>{tdData?.roic}%</td>
                      <td>{tdData?.pe_ratio}%</td>
                      <td>
                        <button
                          onClick={() => {
                            handleRemoveWishList(tdData?.symbol);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="14"
                            viewBox="0 0 13 14"
                            fill="none"
                          >
                            <path
                              d="M7.77349 10.7826C8.05042 10.7826 8.275 10.558 8.275 10.2811V5.26592C8.275 4.98898 8.05042 4.7644 7.77349 4.7644C7.49655 4.7644 7.27197 4.98898 7.27197 5.26592V10.2811C7.27197 10.558 7.49655 10.7826 7.77349 10.7826Z"
                              fill="black"
                            />
                            <path
                              d="M4.26275 10.7826C4.53968 10.7826 4.76426 10.558 4.76426 10.2811V5.26592C4.76426 4.98898 4.53968 4.7644 4.26275 4.7644C3.98581 4.7644 3.76123 4.98898 3.76123 5.26592V10.2811C3.76123 10.558 3.98581 10.7826 4.26275 10.7826Z"
                              fill="black"
                            />
                            <path
                              d="M8.02389 1.00303C8.30083 1.00303 8.52541 0.778452 8.52541 0.501515C8.52541 0.224578 8.30083 0 8.02389 0H4.01177C3.73483 0 3.51025 0.224578 3.51025 0.501515C3.51025 0.778452 3.73483 1.00303 4.01177 1.00303H8.02389Z"
                              fill="black"
                            />
                            <path
                              d="M0.501515 1.50464C0.224578 1.50464 0 1.72922 0 2.00615C0 2.28309 0.224578 2.50767 0.501515 2.50767H1.00303V11.7355C1.00303 12.8689 1.92582 13.7918 3.05924 13.7918H8.97712C10.1105 13.7918 11.0333 12.869 11.0333 11.7355V2.50767H11.5348C11.8118 2.50767 12.0364 2.28309 12.0364 2.00615C12.0364 1.72922 11.8118 1.50464 11.5348 1.50464H10.5318H1.50455H0.501515ZM10.0303 2.50767V11.7355C10.0303 12.3173 9.55888 12.7887 8.97712 12.7887H3.05924C2.47748 12.7887 2.00606 12.3173 2.00606 11.7355V2.50767H10.0303Z"
                              fill="black"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-[10px]">
            <button
              className="cursor-pointer px-4 py-2 bg-[#070707] font-[400] text-[14px] leading-normal tracking-normal xl:tracking-[-0.42px] text-[#F1F4F2]  join-item btn rounded  disabled:!border disabled:!border-[#070707] disabled:!text-[#070707] !shadow-none"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex((prev) => prev - 1)}
            >
              Prev
            </button>
            <button
              className="cursor-pointer px-4 py-2 bg-[#070707] font-[400]  leading-normal tracking-normal xl:tracking-[-0.42px] text-[#F1F4F2]  join-item btn  rounded text-[14px] disabled:!border disabled:!border-[#070707] disabled:!text-[#070707] !shadow-none"
              disabled={pageIndex >= totalPages - 1}
              onClick={() => setPageIndex((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Wishlist;

export const TableHeadData = ({ data, sortKey, onClick, sortState }) => {
  const isActive = sortState.key === sortKey;
  const direction = isActive ? sortState.direction : null;

  return (
    <div
      className="flex items-center gap-[6px] cursor-pointer"
      onClick={onClick}
    >
      <span>{data}</span>
      <span>
        {direction === "asc" ? "↑↑" : direction === "desc" ? "↓↓" : "↑↓"}
      </span>
    </div>
  );
};
