"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

const LatestNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [quantity, setQuantity] = useState(12);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // const [reachMaxLength, setReachMaxLength] = useState(newsData.length);
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/news", {
        params: { quantity, offset },
      });
      const newData = response.data;

      if (newData.length < quantity) {
        setHasMore(false); // No more news to fetch
      }

      setNewsData((prev) => [...prev, ...newData]);
      // setReachMaxLength(response.data.length);
    } catch (error) {
      console.log("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [offset]);
  // console.log("data length", newsData.length);
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset((prev) => prev + quantity);
    }
  };

  return (
    <>
      <div className="latest-news-container grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[14px] justify-center items-center hey">
        {newsData?.map((news, index) => (
          <NewsCard key={index} data={news} />
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

export default LatestNews;
