"use client";

import ForYouNews from "@/app/(dashboards)/dashboard/_components/ForYouNews";
import LatestNews from "@/app/(dashboards)/dashboard/_components/LatestNews";
import TreeMapCanvas from "@/app/(dashboards)/dashboard/_components/TreeMapSummary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const VALID = ["summary", "latest", "forYou"];
const isValid = (v) => typeof v === "string" && VALID.includes(v);

export default function TabContent({ newsForYou, news, summary, followings, initialTab }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialFromUrl = searchParams.get("tab");
  const initialRef = useRef(isValid(initialTab) ? initialTab : isValid(initialFromUrl) ? initialFromUrl : "summary");
  const [tab, setTab] = useState(() => initialRef.current);

  useEffect(() => {
    const t = searchParams.get("tab");
    if (isValid(t) && t !== tab) setTab(t);
  }, []);

  const handleTabChange = (next) => {
    if (!isValid(next) || next === tab) return;
    setTab(next);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const SummaryPanel = useMemo(() => <TreeMapCanvas data={summary?.data ?? []} />, [summary?.data]);
  const LatestPanel = useMemo(() => <LatestNews latestNews={news ?? []} />, [news]);
  const ForYouPanel = useMemo(() => <ForYouNews followings={followings ?? []} newsForYou={newsForYou ?? []} />, [followings, newsForYou]);



  return (
    <div className="tabs tabs-border gap-x-3.5">
      <input
        type="radio"
        name="my_tabs_2"
        className="tab bg-[#F1F2F4] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
        aria-label="Summary"
        checked={tab === "summary"}
        onChange={() => handleTabChange("summary")}
      />
      <div className="tab-content mt-[30px]" hidden={tab !== "summary"}>
        {SummaryPanel}
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        className="tab bg-[#F1F2F4] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
        aria-label="Latest News"
        checked={tab === "latest"}
        onChange={() => handleTabChange("latest")}
      />
      <div className="tab-content mt-[30px]" hidden={tab !== "latest"}>
        {LatestPanel}

      </div>

      <input
        type="radio"
        name="my_tabs_2"
        className="tab bg-[#DEE9FF] py-[7px] !rounded-[33px] !text-[14px] !text-[#070707] tracking-normal xl:tracking-[-0.42px]"
        aria-label="For You"
        checked={tab === "forYou"}
        onChange={() => handleTabChange("forYou")}
      />
      <div className="tab-content mt-[30px]" hidden={tab !== "forYou"}>
        {ForYouPanel}
      </div>
    </div>
  );
}
