"use client";
import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const CustomRadarChart = ({ ticker }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const response = await axios.post("/api/chart_data", { ticker });
        const d = response.data;

        const formattedData = [
          { metric: "ROE (%)", value: d.roe * 100 },
          { metric: "ROIC (%)", value: d.roic * 100 },
          { metric: "Debt/Equity", value: d.debtToEquity },
          { metric: "Current Ratio", value: d.currentRatio },
          { metric: "P/E Ratio", value: d.peRatio },
          { metric: "P/B Ratio", value: d.pbRatio },
          { metric: "FCF Yield (%)", value: d.freeCashFlowYield * 100 },
        ];

        setChartData(formattedData);
        // console.log(radarData);
      } catch (error) {
        console.log("Error fetching radar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) {
      fetchRadarData();
    }
  }, [ticker]);
  return (
    <>
      <>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
          </div>
        ) : chartData?.length === 0 ? (
          <></>
        ) : (
          <>
            <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px]">
              <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
                Debt/Equity Chart
              </div>
              <div className="max-w-[860px] mx-auto w-full">
                <div style={{ width: 500, height: 400 }}>
                  <ResponsiveContainer>
                    <RadarChart data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis />
                      <Radar
                        name={ticker}
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        formatter={(value) =>
                          typeof value === "number" ? value.toFixed(2) : value
                        }
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default CustomRadarChart;
