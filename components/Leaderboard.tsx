"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface LeaderboardEntry {
  wallet_address: string;
  score: number;
  date: string;
  rank: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const { publicKey } = useWallet();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);

        if (publicKey) {
          const userEntry = data.leaderboard?.find(
            (entry: LeaderboardEntry) => entry.wallet_address === publicKey.toBase58()
          );
          setUserRank(userEntry?.rank || null);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000);

    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-gradient">
        Daily Top 50
      </h2>
      <p className="text-center text-sm text-gray-400 mb-4">
        Top 50 win merch 👕
      </p>

      {userRank && (
        <div className="bg-garfield-orange/20 border border-garfield-orange rounded-lg p-3 mb-4">
          <p className="text-center font-semibold">
            Your Rank: #{userRank}
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No scores yet. Be the first!</p>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.wallet_address + entry.date}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index < 50
                  ? "bg-gradient-to-r from-garfield-yellow/10 to-garfield-orange/10 border border-garfield-yellow/30"
                  : "bg-gray-700/30"
              } ${
                publicKey && entry.wallet_address === publicKey.toBase58()
                  ? "ring-2 ring-garfield-orange"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-garfield-yellow w-8">
                  #{entry.rank}
                </span>
                <span className="text-sm text-gray-300 font-mono">
                  {entry.wallet_address.slice(0, 4)}...{entry.wallet_address.slice(-4)}
                </span>
              </div>
              <span className="text-lg font-bold text-gradient">
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
