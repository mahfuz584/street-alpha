"use client";
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const CustomRadialChart = ({ ticker }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/financial-summary", {
          params: { ticker },
        });

        const d = res.data;

        const formattedData = [
          {
            name: "Revenue (B)",
            value: d.fundamentals.revenue / 1_000_000_000,
            fill: "#8884d8",
          },
          {
            name: "Net Income (B)",
            value: d.fundamentals.netIncome / 1_000_000_000,
            fill: "#82ca9d",
          },
          {
            name: "Total Assets (B)",
            value: d.fundamentals.totalAssets / 1_000_000_000,
            fill: "#ffc658",
          },
          {
            name: "Free Cash Flow (B)",
            value: d.fundamentals.freeCashFlow / 1_000_000_000,
            fill: "#ff8042",
          },
          { name: "ROE (%)", value: d.ratios.roe * 100, fill: "#a4de6c" },
          { name: "ROIC (%)", value: d.ratios.roic * 100, fill: "#d0ed57" },
          {
            name: "Current Ratio",
            value: d.ratios.currentRatio,
            fill: "#8dd1e1",
          },
          {
            name: "Debt/Equity",
            value: d.ratios.debtToEquity,
            fill: "#ffbb28",
          },
          { name: "P/E Ratio", value: d.ratios.peRatio, fill: "#ff6666" },
          { name: "P/B Ratio", value: d.ratios.pbRatio, fill: "#aa66cc" },
          {
            name: "FCF Margin (%)",
            value: d.margins?.fcfMargin || 0,
            fill: "#00bcd4",
          },
        ];

        setChartData(formattedData);
      } catch (err) {
        console.log("Error fetching financial summary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  const legendStyle = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "24px",
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
      </div>
    );

  return (
    <>
      {chartData?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px] ">
            <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
              Financial Summary
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="90%"
                barSize={16}
                data={chartData}
              >
                <RadialBar
                  minAngle={15}
                  label={{
                    position: "insideStart",
                    fill: "#fff",
                    fontSize: 10,
                  }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  wrapperStyle={legendStyle}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name.includes("(B)")) return `${value.toFixed(2)}B`;
                    if (name.includes("%")) return `${value.toFixed(2)}%`;
                    return value.toFixed(2);
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </>
  );
};

export default CustomRadialChart;
