import { createContext, useContext, useState, useEffect } from "react";

const MatchTimerContext = createContext();

export const MatchTimerProvider = ({ children }) => {
  const [endTime, setEndTime] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState(null);

  const getRemaining = (target) => {
    if (!target) return 0;
    return Math.max(0, Math.floor((target - Date.now()) / 1000));
  };

  // ✅ Helper: parse duration like "1h 0m" => total minutes
  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const hoursMatch = durationStr.match(/(\d+)h/);
    const minutesMatch = durationStr.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return hours * 60 + minutes;
  };

  const startMatch = (durationStr, slotId) => {
    if (activeSlotId && activeSlotId !== slotId) {
      console.warn("Another match is already running!");
      return;
    }

    const totalMinutes = parseDuration(durationStr);
    if (isNaN(totalMinutes) || totalMinutes <= 0) {
      console.error("Invalid duration:", durationStr);
      return;
    }

    const newEndTime = Date.now() + totalMinutes * 60 * 1000;
    setEndTime(newEndTime);
    setRemaining(getRemaining(newEndTime));
    setIsRunning(true);
    setActiveSlotId(slotId);
  };

  const stopMatch = () => {
    setIsRunning(false);
    if (endTime) setRemaining(getRemaining(endTime));
  };

  const resumeMatch = () => {
    if (remaining > 0) {
      const newEndTime = Date.now() + remaining * 1000;
      setEndTime(newEndTime);
      setIsRunning(true);
    }
  };

  const resetMatch = () => {
    setEndTime(null);
    setRemaining(0);
    setIsRunning(false);
    setActiveSlotId(null);
  };

  useEffect(() => {
    if (!endTime || !isRunning) return;
    const interval = setInterval(() => {
      setRemaining(getRemaining(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, isRunning]);

  return (
    <MatchTimerContext.Provider
      value={{
        remaining,
        startMatch,
        stopMatch,
        resumeMatch,
        resetMatch,
        endTime,
        isRunning,
        activeSlotId,
      }}
    >
      {children}
    </MatchTimerContext.Provider>
  );
};

export const useMatchTimer = () => useContext(MatchTimerContext);
