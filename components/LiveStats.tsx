"use client";

import { useState, useEffect } from "react";

export default function LiveStats() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    playersToday: 0,
    topScore: 0,
  });

  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-8 justify-center items-center py-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient">0</div>
          <div className="text-sm text-gray-400 mt-2">Players Today</div>
        </div>
        <div className="h-12 w-px bg-gray-700"></div>
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient">0</div>
          <div className="text-sm text-gray-400 mt-2">Top Score Today</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8 justify-center items-center py-8">
      <div className="text-center">
        <div className="text-4xl font-bold text-gradient">{stats.playersToday.toLocaleString()}</div>
        <div className="text-sm text-gray-400 mt-2">Players Today</div>
      </div>
      <div className="h-12 w-px bg-gray-700"></div>
      <div className="text-center">
        <div className="text-4xl font-bold text-gradient">{stats.topScore.toLocaleString()}</div>
        <div className="text-sm text-gray-400 mt-2">Top Score Today</div>
      </div>
    </div>
  );
}
