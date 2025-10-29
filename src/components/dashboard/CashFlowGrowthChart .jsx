"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CashFlowGrowthChart = ({ ticker }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.post("/api/cash_flow_growth", {
          ticker,
          period: "FY",
          limit: 10,
        });

        const data = response.data.data;

        const formattedData = data.map((item) => ({
          date: new Date(item.date).getFullYear().toString(),
          growthOperatingCashFlow: Number(
            (item.growthOperatingCashFlow * 100).toFixed(2)
          ),
          growthFreeCashFlow: Number(
            (item.growthFreeCashFlow * 100).toFixed(2)
          ),
          growthCapitalExpenditure: Number(
            (item.growthCapitalExpenditure * 100).toFixed(2)
          ),
        }));

        setChartData(formattedData.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) {
      fetchChartData();
    }
  }, [ticker]);

  if (isLoading)
    return (
      <div className="text-center py-6 text-gray-500">Loading chart...</div>
    );

  return (
    <>
      {chartData.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px]  mx-auto">
            <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
              Cash Flow Growth (yearly) %
            </div>
            <div style={{ width: "100%", height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ocfColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fcfColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="capexColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="growthOperatingCashFlow"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#ocfColor)"
                    name="Operating Cash Flow"
                  />
                  <Area
                    type="monotone"
                    dataKey="growthFreeCashFlow"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#fcfColor)"
                    name="Free Cash Flow"
                  />
                  <Area
                    type="monotone"
                    dataKey="growthCapitalExpenditure"
                    stroke="#ff7300"
                    fillOpacity={1}
                    fill="url(#capexColor)"
                    name="Capital Expenditure"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CashFlowGrowthChart;
