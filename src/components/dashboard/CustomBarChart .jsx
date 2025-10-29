"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data based on your chart
const data = [
  {
    date: "2016",
    operatingIncome: 2,
    netIncome: 1.5,
    grossProfit: 3,
    revenue: 5,
    costAndExpenses: 2.5,
  },
  {
    date: "2017",
    operatingIncome: 3,
    netIncome: 2.5,
    grossProfit: 4,
    revenue: 6,
    costAndExpenses: 3,
  },
  {
    date: "2018",
    operatingIncome: 4,
    netIncome: 3.5,
    grossProfit: 5,
    revenue: 8,
    costAndExpenses: 3.5,
  },
  {
    date: "2019",
    operatingIncome: 5,
    netIncome: 4.5,
    grossProfit: 6,
    revenue: 10,
    costAndExpenses: 4,
  },
  {
    date: "2020",
    operatingIncome: 6,
    netIncome: 5,
    grossProfit: 7,
    revenue: 12,
    costAndExpenses: 5,
  },
  {
    date: "2021",
    operatingIncome: 12,
    netIncome: 10,
    grossProfit: 14,
    revenue: 18,
    costAndExpenses: 8,
  },
  {
    date: "2022",
    operatingIncome: 20,
    netIncome: 18,
    grossProfit: 22,
    revenue: 28,
    costAndExpenses: 12,
  },
  {
    date: "2023",
    operatingIncome: 25,
    netIncome: 22,
    grossProfit: 28,
    revenue: 30,
    costAndExpenses: 20,
  },
  {
    date: "2024",
    operatingIncome: 35,
    netIncome: 30,
    grossProfit: 45,
    revenue: 60,
    costAndExpenses: 28,
  },
  {
    date: "2025",
    operatingIncome: 82,
    netIncome: 75,
    grossProfit: 95,
    revenue: 132,
    costAndExpenses: 48,
  },
];
const CustomBarChart = ({ ticker }) => {
  const [barChart, setBarChart] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.post("/api/bar_chart", { ticker });
        const data = response.data;
        const barChartData = data.map((item) => ({
          date: new Date(item.date).getFullYear().toString(),
          revenue: item.revenue / 1_000_000_000,
          grossProfit: item.grossProfit / 1_000_000_000,
          operatingIncome: item.operatingIncome / 1_000_000_000,
          netIncome: item.netIncome / 1_000_000_000,
          costAndExpenses: item.costAndExpenses / 1_000_000_000,
        }));
        setBarChart(barChartData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (ticker) {
      fetchBarChartData();
    }
  }, [ticker]);
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
        </div>
      ) : barChart?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px]">
            <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
              Revenue & Operating Income & Net Income
            </div>
            <div className="max-w-[860px] mx-auto w-full">
              <div style={{ width: "100%", height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChart}
                    barSize={24}
                    margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value}B`} />
                    <Tooltip formatter={(value) => `${value}B`} />
                    <Legend />
                    <Bar
                      dataKey="operatingIncome"
                      fill="#6366F1"
                      name="Operating Income"
                    />
                    <Bar dataKey="netIncome" fill="#EF4444" name="Net Income" />
                    <Bar
                      dataKey="grossProfit"
                      fill="#10B981"
                      name="Gross Profit"
                    />
                    <Bar dataKey="revenue" fill="#A855F7" name="Revenue" />
                    <Bar
                      dataKey="costAndExpenses"
                      fill="#F59E0B"
                      name="Cost & Expenses"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomBarChart;
