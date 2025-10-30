"use client";

import NewsCard from "@/components/dashboard/NewsCard";
import axios from "axios";
import { useState } from "react";

const ForYouNews = ({ followings, newsForYou }) => {
  const initialData = newsForYou?.data;

  if (
    !followings ||
    followings.length === 0 ||
    !initialData ||
    Object.keys(initialData).length === 0
  ) {
    return (
      <p className="text-center text-gray-500">
        Something went wrong or you are not following any companies yet.
      </p>
    );
  }

  const initialFlat = Array.isArray(initialData)
    ? initialData
    : Object.values(initialData).flat();

  const [forYouNewData, setForYouNewsData] = useState(initialFlat);
  console.log("🚀 ~ ForYouNews ~ forYouNewData:", forYouNewData)

  const [offset, setOffset] = useState(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const flatNewsForYouArray = forYouNewData.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const quantity = 9;

      const params = new URLSearchParams();
      params.append("quantity", quantity);
      params.append("offset", offset);
      followings.forEach((item) => params.append("tickers", item.symbol));

      const res = await axios.get(`/api/news_by_symbols?${params.toString()}`);
      const newDataGrouped = res.data || {};

      const newFlatData = Object.values(newDataGrouped).flat();

      if (newFlatData.length === 0) {
        setHasMore(false);
        return;
      }

      const existingIds = new Set(
        forYouNewData.map((item) => item.id || item._id)
      );
      const filteredNewData = newFlatData.filter(
        (item) => !existingIds.has(item.id || item._id)
      );

      if (filteredNewData.length > 0) {
        setForYouNewsData((prev) => [...prev, ...filteredNewData]);
      }

      setOffset((prev) => prev + quantity);

      if (newFlatData.length < quantity) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more news:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="latest-news-container grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[14px]">
        {flatNewsForYouArray.map((news) => (
          <NewsCard key={news.id || news._id} data={news} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 rounded bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
};

export default ForYouNews;
