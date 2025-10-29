"use client";
import { createContext, useContext, useState } from "react";

//create following context
const FollowingContext = createContext();

export const FollowingProvider = ({ children }) => {
  const [matchedSymbols, setMatchedSymbols] = useState([]);
  return (
    <>
      <FollowingContext.Provider value={{ matchedSymbols, setMatchedSymbols }}>
        {children}
      </FollowingContext.Provider>
    </>
  );
};
export const useFollowing = () => useContext(FollowingContext);
