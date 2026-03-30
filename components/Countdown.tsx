"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const targetDate = new Date("2026-04-15T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center items-center">
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient">00</div>
          <div className="text-sm text-gray-400 mt-1">Days</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient">00</div>
          <div className="text-sm text-gray-400 mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient">00</div>
          <div className="text-sm text-gray-400 mt-1">Mins</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-gradient">00</div>
          <div className="text-sm text-gray-400 mt-1">Secs</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-center items-center">
      <div className="text-center">
        <div className="text-5xl font-bold text-gradient">{String(timeLeft.days).padStart(2, "0")}</div>
        <div className="text-sm text-gray-400 mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-gradient">{String(timeLeft.hours).padStart(2, "0")}</div>
        <div className="text-sm text-gray-400 mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-gradient">{String(timeLeft.minutes).padStart(2, "0")}</div>
        <div className="text-sm text-gray-400 mt-1">Mins</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold text-gradient">{String(timeLeft.seconds).padStart(2, "0")}</div>
        <div className="text-sm text-gray-400 mt-1">Secs</div>
      </div>
    </div>
  );
}
