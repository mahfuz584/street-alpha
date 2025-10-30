"use client";

import axios from "axios";
import { useState } from "react";
import NewsCard from "../../../../components/dashboard/NewsCard";

const LatestNews = ({ latestNews:initialData }) => {
  const [allNewsData, setAllNewsData] = useState(initialData.data);
  console.log("🚀 ~ LatestNews ~ allNewsData:", allNewsData)
  const [loading, setLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(initialData.data.length);

  const quantity = 9;

  const handleLoadMore = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/api/news", {
        params: {
          quantity: quantity,
          offset: currentOffset,
        },
      });

      const newData = response.data;

      setAllNewsData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id || item._id));
        const uniqueNewData = newData.filter(
          (item) => !existingIds.has(item.id || item._id)
        );
        return [...prev, ...uniqueNewData];
      });

      setCurrentOffset((prev) => prev + quantity);
    } catch (error) {
      console.error("Failed to load more news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="latest-news-container grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[14px] justify-center items-center">
        {allNewsData?.map((news) => (
          <NewsCard key={news.id || news._id} data={news} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-6 py-2 rounded bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </>
  );
};

export default LatestNews;
