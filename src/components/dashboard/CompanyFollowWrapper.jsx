"use client";

import { useFollowing } from "@/app/context/FollowingContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import CompanyList from "./CompanyList";

const CompanyFollowWrapper = ({ tickers, onUnlock }) => {
  const { data: session } = useSession();
  const user = session?.user;

  const { matchedSymbols, setMatchedSymbols } = useFollowing();
  const [displayedTickers, setDisplayedTickers] = useState([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const loaderRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // Load more tickers (virtual scroll)
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setDisplayedTickers(tickers.slice(0, page * ITEMS_PER_PAGE));
      setIsLoading(false);
    };
    load();
  }, [page, tickers]);

  // Intersection observer to increment page
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  // Fetch existing followings on mount / when user or tickers change
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/followings`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        const followingData = response.data?.data || [];
        const symbols = followingData.map((f) => f.symbol);
        setMatchedSymbols(symbols);

        // Pass the count to onUnlock instead of calling without parameters
        if (onUnlock) {
          onUnlock(symbols.length);
        }
      } catch (err) {
        console.log("Error fetching followings in wrapper:", err);
        // Still call onUnlock with 0 count in case of error
        if (onUnlock) {
          onUnlock(0);
        }
      }
    };
    fetchFollowing();
  }, [user, tickers, setMatchedSymbols, onUnlock]);

  // Follow / unfollow handler
  const handleFollow = useCallback(
    async (ticker) => {
      if (!user) return;
      const { symbol, companyName } = ticker;

      if (matchedSymbols.includes(symbol)) {
        // unfollow
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/unfollow`,
            { symbol },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          if (response.data) {
            const newSymbols = matchedSymbols.filter((s) => s !== symbol);
            setMatchedSymbols(newSymbols);
            // Update parent with new count
            if (onUnlock) {
              onUnlock(newSymbols.length);
            }
          }
        } catch (err) {
          console.log("Error unfollowing company:", err);
        }
      } else {
        // follow
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/follow`,
            { symbol, companyName },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          if (response.data) {
            const newSymbols = [...matchedSymbols, symbol];
            setMatchedSymbols(newSymbols);
            // Update parent with new count
            if (onUnlock) {
              onUnlock(newSymbols.length);
            }
          }
        } catch (err) {
          console.log("Error following company:", err);
        }
      }
    },
    [matchedSymbols, setMatchedSymbols, user, onUnlock]
  );

  return (
    <>
      <Suspense fallback={<div>{isLoading}</div>}>
        <CompanyList
          handleFollow={handleFollow}
          matchedSymbols={matchedSymbols}
          displayedTickers={displayedTickers}
          isLoading={isLoading}
          loaderRef={loaderRef}
        />
      </Suspense>
    </>
  );
};

export default CompanyFollowWrapper;
