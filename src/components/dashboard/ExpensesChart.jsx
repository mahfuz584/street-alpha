"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ExpensesChart = ({ ticker }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://54.210.247.12:5000/cash_income_combined/${ticker}`, {
        params: {
          period: "FY",
          limit: 10,
        },
      })
      .then((res) => {
        setData(res.data?.data || []);
      })
      .catch((err) => {
        console.log("API fetch error:", err.message);
      })
      .finally(setIsLoading(false));
  }, []);

  const formatBillions = (num) => {
    if (!num && num !== 0) return "";
    return `${(num / 1e9).toFixed(1)}B`;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
        </div>
      ) : data?.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="pt-[26px] mt-[50px] rounded-[8px] border-[0.5px] border-[#B3B3B3] bg-[#FFF] ps-[19px] pb-[40px]">
            <div className="text-[20px] font-medium text-[#070707] mb-[50px] leading-normal">
              Expenses
            </div>
            <div className="max-w-[860px] mx-auto w-full">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatBillions} />
                  <Tooltip formatter={(value) => formatBillions(value)} />
                  <Legend />

                  <Bar
                    dataKey="researchAndDevelopmentExpenses"
                    fill="#636EFA"
                    name="R&D Expenses"
                  />
                  <Bar
                    dataKey="generalAndAdministrativeExpenses"
                    fill="#EF553B"
                    name="General & Admin"
                  />
                  <Bar
                    dataKey="operatingExpenses"
                    fill="#00CC96"
                    name="Operating Expenses"
                  />
                  <Bar
                    dataKey="costAndExpenses"
                    fill="#AB63FA"
                    name="Cost & Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ExpensesChart;
