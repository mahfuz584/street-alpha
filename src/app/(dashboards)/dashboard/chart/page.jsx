"use client";

import { useFollowingData } from "@/app/hooks/useFollowing";
import CashFlowGrowthChart from "@/components/dashboard/CashFlowGrowthChart ";
import CompanySwiperSlider from "@/components/dashboard/CompanySwiperSlider";
import CustomBarChart from "@/components/dashboard/CustomBarChart ";
import CustomLineChart from "@/components/dashboard/CustomLineChart ";
import CustomRadarChart from "@/components/dashboard/CustomRadarChart";
import CustomRadialChart from "@/components/dashboard/CustomRadialChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";

import axios from "axios";
import { useEffect, useState } from "react";

const Chart = () => {
  const { matchedSymbols } = useFollowingData();
  const [tickersData, setTickersData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (!matchedSymbols || matchedSymbols.length === 0) return;
    if (initialLoadDone) return; // ✅ don’t refetch after first load

    const fetchTickers = async () => {
      setIsDataFetching(true);
      try {
        const response = await axios.post("/api/all_chart", {
          tickers: matchedSymbols,
        });
        const data = response.data || [];
        setTickersData(data);

        if (data.length > 0) {
          setActiveTab(data[0]?.data?.companyName || null);
        }

        setInitialLoadDone(true); // ✅ mark complete
      } catch (err) {
        console.log("Error fetching tickers:", err);
      } finally {
        setIsDataFetching(false);
      }
    };

    fetchTickers();
  }, [matchedSymbols, initialLoadDone]);
  const simplifiedData = tickersData.map((item) => ({
    ticker: item.ticker,
    companyName: item.data?.companyName || "N/A",
    image: item.data?.image || "https://via.placeholder.com/100",
  }));
  const isLoading = !initialLoadDone && isDataFetching;

  console.log("simplifiedData", simplifiedData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="tabs tabs-border gap-3.5 flex flex-col">
        <CompanySwiperSlider
          simplifiedData={simplifiedData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="tab-content mt-[30px] block">
          {simplifiedData
            .filter((company) => company.companyName === activeTab)
            .map((company) => (
              <div key={company.ticker}>
                <CustomRadarChart ticker={company?.ticker} />
                <CustomBarChart ticker={company?.ticker} />
                <CustomLineChart ticker={company?.ticker} />
                <CashFlowGrowthChart ticker={company?.ticker} />
                <CustomRadialChart ticker={company?.ticker} />
                <ExpensesChart ticker={company?.ticker} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;
