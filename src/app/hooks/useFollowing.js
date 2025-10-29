import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export const useFollowingData = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [followings, setFollowings] = useState([]);
  const [matchedSymbols, setMatchedSymbols] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch following data
  const fetchFollowing = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

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
      setFollowings(followingData);

      // Extract symbols of followings
      const followingSymbols = followingData.map((f) => f.symbol);
      setMatchedSymbols(followingSymbols);

      return followingSymbols;
    } catch (error) {
      console.log("Error fetching followings:", error);
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch when user changes
  useEffect(() => {
    fetchFollowing();
  }, [user]);

  return {
    followings,
    matchedSymbols,
    setMatchedSymbols,
    // handleFollow,
    fetchFollowing,
    isLoading,
    setIsLoading,
    error,
  };
};
