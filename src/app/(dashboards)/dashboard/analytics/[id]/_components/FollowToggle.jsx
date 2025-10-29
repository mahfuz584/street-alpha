"use client";

import { useFollowingData } from "@/app/hooks/useFollowing";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";

const FollowToggle = ({ ticker, onChange }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const { matchedSymbols, setMatchedSymbols } = useFollowingData();
  const [pending, setPending] = useState(false);

  const { symbol, companyName } = useMemo(() => {
    if (typeof ticker === "string")
      return { symbol: ticker, companyName: undefined };
    return { symbol: ticker?.symbol, companyName: ticker?.companyName };
  }, [ticker]);

  const isFollowing = matchedSymbols?.includes(symbol);

  const handleFollow = useCallback(async () => {
    if (!user || !symbol || pending) return;

    setPending(true);
    const prev = matchedSymbols;
    const next = isFollowing
      ? prev.filter((s) => s !== symbol)
      : [...prev, symbol];
    setMatchedSymbols(next);
    onChange?.(next);

    try {
      if (isFollowing) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/unfollow`,
          { symbol },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/follow`,
          { symbol, companyName: companyName ?? symbol },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
      }
    } catch {
      setMatchedSymbols(prev);
      onChange?.(prev);
    } finally {
      setPending(false);
    }
  }, [
    user,
    symbol,
    companyName,
    isFollowing,
    pending,
    matchedSymbols,
    setMatchedSymbols,
    onChange,
  ]);

  return (
    <button
      onClick={handleFollow}
      disabled={!user || pending || !symbol}
      className={`px-[10px] py-[4px] rounded-[34px] text-[14px] leading-[1.5] tracking-[-0.42px] border
        ${
          isFollowing
            ? "bg-[#69FB7F] text-[#070707] border-transparent"
            : "bg-white text-[#070707] border-[#000]"
        }
        ${
          !user || pending || !symbol
            ? "opacity-60 cursor-not-allowed"
            : "hover:opacity-90"
        }
      `}
      aria-pressed={isFollowing}
      aria-busy={pending}
      title={!user ? "Sign in to follow" : isFollowing ? "Unfollow" : "Follow"}
    >
      {pending
        ? isFollowing
          ? "Unfollowing..."
          : "Following..."
        : isFollowing
        ? "Following"
        : "Follow"}
    </button>
  );
};

export default FollowToggle;
