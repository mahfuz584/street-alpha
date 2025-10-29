"use client";
import { useFollowingData } from "@/app/hooks/useFollowing";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 3;

const Analytics = () => {
  const { matchedSymbols, isLoading: followingLoading } = useFollowingData();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (followingLoading || !matchedSymbols || matchedSymbols.length === 0)
      return;
    if (analyticsData.length > 0) return;

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tickers: matchedSymbols }),
        });

        const data = await res.json();
        setAnalyticsData(data);
        setInitialLoadDone(true);
      } catch (err) {
        console.log("Analytics fetch failed", err);
        setAnalyticsData([]);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [matchedSymbols, followingLoading, analyticsData.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleAnalytics = analyticsData.slice(0, visibleCount);
  const isLoading = !initialLoadDone && (followingLoading || analyticsLoading);
  const showNoDataFound =
    !followingLoading &&
    matchedSymbols?.length > 0 &&
    !analyticsLoading &&
    analyticsData?.length === 0;

  const showNoCompaniesFollowed =
    !followingLoading && matchedSymbols?.length === 0;

  return (
    <>
      <>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
          </div>
        ) : showNoDataFound ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No analytics data found for your followed companies at this moment.
          </div>
        ) : (
          <div className="analytics-container w-full grid grid-cols-2 xl:grid-cols-3 gap-[34px] auto-rows-fr justify-center items-center">
            {" "}
            {visibleAnalytics?.map((data) => (
              <AnalyticsCard key={data.id} analyticData={data} />
            ))}{" "}
          </div>
        )}
      </>

      {!isLoading &&
        !showNoDataFound &&
        !showNoCompaniesFollowed &&
        visibleCount < analyticsData?.length && (
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-[#070707] text-white rounded transition"
            >
              Load More
            </button>
          </div>
        )}
    </>
  );
};

export default Analytics;
