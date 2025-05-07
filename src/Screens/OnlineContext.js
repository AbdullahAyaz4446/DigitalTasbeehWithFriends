// OnlineContext.js
import React, { createContext, useState, useEffect } from 'react';

export const OnlineContext = createContext();

export const OnlineProvider = ({ children, userId }) => {
  const [online, setOnline] = useState(null);

  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const query = `Getip?userid=${encodeURIComponent(userId)}`;
        const response = await fetch(Online + query);
        setOnline(response.ok ? "Online" : "Offline");
      } catch {
        setOnline("Offline");
      }
    };
    checkOnlineStatus();
    const intervalId = setInterval(checkOnlineStatus, 100000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <OnlineContext.Provider value={{ online, setOnline }}>
      {children}
    </OnlineContext.Provider>
  );
};

