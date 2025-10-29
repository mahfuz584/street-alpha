import CashFlowGrowthChart from "@/components/dashboard/CashFlowGrowthChart ";
import CustomBarChart from "@/components/dashboard/CustomBarChart ";
import CustomLineChart from "@/components/dashboard/CustomLineChart ";
import CustomRadarChart from "@/components/dashboard/CustomRadarChart";
import CustomRadialChart from "@/components/dashboard/CustomRadialChart";
import ExpensesChart from "@/components/dashboard/ExpensesChart";
import axios from "axios";
import React from "react";

const CompanyGraphPage = async ({ params }) => {
  const awaitedParams = await params;
  const ticker = awaitedParams.cId;
  let tickerData = {};

  try {
    const response = await axios.get(
      `http://54.210.247.12:5000/ticker/${ticker}`
    );
    tickerData = response?.data;
  } catch (error) {
    console.log(`Failed to fetch ticker data for ${ticker}:`, error.message);
    // You can also return an error UI here if needed
    tickerData = {
      companyName: "Data not available",
      logo: "/assets/images/placeholder.svg",
    };
  }
  const { companyName, image } = tickerData;
  return (
    <div className="w-full max-w-[1080px] mx-auto flex flex-col justify-center">
      <div className="flex items-center gap-[13px] pb-[34px] px-[20px]">
        <div className="w-full max-w-[70px]">
          <img
            src={image || "/assets/images/tesla.svg"}
            alt={companyName}
            className="w-full h-full object-cover object-center rounded-sm"
          />
        </div>
        <div>
          <h4 className="xl:text-[26px] text-[22px] text-[#070707] font-medium mb-[6px] mt-0 leading-normal">
            {companyName}
          </h4>
          <div className="text-[14px]">{ticker}</div>
        </div>
      </div>
      <div className="space-y-[30px]">
        <CustomRadarChart ticker={ticker} />
        <CustomLineChart ticker={ticker} />
        <CustomBarChart ticker={ticker} />
        <CustomRadialChart ticker={ticker} />
        <CashFlowGrowthChart ticker={ticker} />
        <ExpensesChart ticker={ticker} />
      </div>
    </div>
  );
};

export default CompanyGraphPage;
