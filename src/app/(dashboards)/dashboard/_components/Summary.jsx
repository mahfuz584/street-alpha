"use client";

import { use } from "react";
import TreeMapCanvas from "./TreeMapSummary";

const Summary = ({ summaryPromise }) => {
  const { data: summaryData, error } = use(summaryPromise);

  if (!summaryData || error) return <div>No summary data available.</div>;

  return <TreeMapCanvas data={summaryData} />;
};

export default Summary;
