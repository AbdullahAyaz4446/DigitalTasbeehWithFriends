// OnlineContext.js
import React, { createContext, useState, useEffect } from 'react';

export const OnlineContext = createContext();

export const OnlineProvider = ({ children, userId }) => {
  const [online, setOnline] = useState(null);

  const checkOnlineStatus = async () => {
    try {
      const query = `Getip?userid=${encodeURIComponent(userId)}`;
      const response = await fetch(Online + query);
      const result = await response.text(); 
      console.log(result);
      setOnline(result=="Online" ? "Online" : "Offline");
      console.log(online);
    } catch {
      console.log("Error fetching online status");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(()=>{
      checkOnlineStatus();
    }, 100000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <OnlineContext.Provider value={{ online, setOnline }}>
      {children}
    </OnlineContext.Provider>
  );
}; 

