"use client";

import TreeMapCanvas from "@/app/(dashboards)/dashboard/_components/TreeMapSummary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ForYouNews from "../../app/(dashboards)/dashboard/_components/ForYouNews";
import LatestNews from "../../app/(dashboards)/dashboard/_components/LatestNews";

const TabContent = ({ newsForYou, news, summary, followings }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get("tab") || "summary";

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="tabs tabs-border gap-x-3.5">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab bg-[#F1F2F4] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
          aria-label="Summary"
          checked={activeTab === "summary"}
          onChange={() => handleTabChange("summary")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "summary" && <TreeMapCanvas data={summary.data} />}
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          className="tab bg-[#F1F2F4] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
          aria-label="Latest News"
          checked={activeTab === "latest"}
          onChange={() => handleTabChange("latest")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "latest" && <LatestNews latestNews={news} />}
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          className="tab bg-[#DEE9FF] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
          aria-label="For You"
          checked={activeTab === "forYou"}
          onChange={() => handleTabChange("forYou")}
        />
        <div className="tab-content mt-[30px]">
          {activeTab === "forYou" && (
            <ForYouNews followings={followings} newsForYou={newsForYou} />
          )}
        </div>
      </div>
    </>
  );
};

export default TabContent;
