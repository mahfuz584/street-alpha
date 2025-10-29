"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample ratio data
const data = [
  {
    date: "2016",
    netIncomeRatio: 0.13,
    operatingIncomeRatio: 0.17,
    grossProfitRatio: 0.56,
  },
  {
    date: "2017",
    netIncomeRatio: 0.25,
    operatingIncomeRatio: 0.28,
    grossProfitRatio: 0.58,
  },
  {
    date: "2018",
    netIncomeRatio: 0.31,
    operatingIncomeRatio: 0.33,
    grossProfitRatio: 0.6,
  },
  {
    date: "2019",
    netIncomeRatio: 0.35,
    operatingIncomeRatio: 0.32,
    grossProfitRatio: 0.61,
  },
  {
    date: "2020",
    netIncomeRatio: 0.26,
    operatingIncomeRatio: 0.26,
    grossProfitRatio: 0.62,
  },
  {
    date: "2021",
    netIncomeRatio: 0.27,
    operatingIncomeRatio: 0.27,
    grossProfitRatio: 0.63,
  },
  {
    date: "2022",
    netIncomeRatio: 0.36,
    operatingIncomeRatio: 0.37,
    grossProfitRatio: 0.65,
  },
  {
    date: "2023",
    netIncomeRatio: 0.18,
    operatingIncomeRatio: 0.16,
    grossProfitRatio: 0.57,
  },
  {
    date: "2024",
    netIncomeRatio: 0.48,
    operatingIncomeRatio: 0.54,
    grossProfitRatio: 0.72,
  },
  {
    date: "2025",
    netIncomeRatio: 0.52,
    operatingIncomeRatio: 0.62,
    grossProfitRatio: 0.74,
  },
];

const CustomLineChart = ({ ticker }) => {
  const [loading, setLoading] = useState(true);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await axios.post("/api/line_chart", { ticker });
        const data = response.data;
        const lineData = data.map((item) => ({
          date: new Date(item.date).getFullYear().toString(),
          netIncomeRatio: item.netIncomeRatio,
          operatingIncomeRatio: item.operatingIncomeRatio,
          grossProfitRatio: item.grossProfitRatio,
        }));

        setLineChartData(lineData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (ticker) {
      fetchLineChartData();
    }
  }, [ticker]);
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
        </div>
      ) : lineChartData?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px]">
            <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
              MARGINGS -- Net Income Ratio & Gross Profit Ratio
            </div>
            <div className="max-w-[860px] mx-auto w-full">
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, 1]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      formatter={(value) => `${(value * 100).toFixed(1)}%`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="netIncomeRatio"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Net Income Ratio"
                    />
                    <Line
                      type="monotone"
                      dataKey="operatingIncomeRatio"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Operating Income Ratio"
                    />
                    <Line
                      type="monotone"
                      dataKey="grossProfitRatio"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Gross Profit Ratio"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomLineChart;
