"use client";

import NewsCardSkeleton from "@/app/(dashboards)/dashboard/_components/NewsCardSkelton";
import Summary from "@/app/(dashboards)/dashboard/_components/Summary";
import { Suspense, useState } from "react";
import ForYouNews from "../../app/(dashboards)/dashboard/_components/ForYouNews";
import LatestNews from "../../app/(dashboards)/dashboard/_components/LatestNews";

const TabContent = ({
  followings,
  newsPromise,
  newsForYouPromise,
  summaryPromise,
}) => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <>
      <div className="tabs gap-x-3.5 tabs-border">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab py-[7px] !text-[#070707] !text-[14px] tracking-normal xl:tracking-[-0.42px] bg-[#F1F2F4] !rounded-[33px]"
          aria-label="Summary"
          defaultChecked
          onChange={() => setActiveTab("summary")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "summary" && (
            <Suspense
              fallback={
                <div className="max-w-full h-96 bg-gray-200 rounded-lg skeleton-box"></div>
              }
            >
              <Summary summaryPromise={summaryPromise} />
            </Suspense>
          )}
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          className="tab py-[7px] !text-[#070707] !text-[14px] tracking-normal xl:tracking-[-0.42px] bg-[#F1F2F4] !rounded-[33px] "
          aria-label="Latest News"
          onChange={() => setActiveTab("latest")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "latest" && (
            <Suspense
              fallback={
                <div className="latest-news-container grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[14px]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <LatestNews newsPromise={newsPromise} />
            </Suspense>
          )}
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          className="tab py-[7px] !text-[#070707] !text-[14px] tracking-normal xl:tracking-[-0.42px] bg-[#DEE9FF] !rounded-[33px] "
          aria-label="For You"
          onChange={() => setActiveTab("forYou")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "forYou" && (
            <Suspense
              fallback={
                <div className="latest-news-container grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[14px]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <ForYouNews
                followings={followings}
                newsForYouPromise={newsForYouPromise}
              />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
};

export default TabContent;
