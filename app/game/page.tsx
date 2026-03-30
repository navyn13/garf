"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import WalletButton from "@/components/WalletButton";
import Leaderboard from "@/components/Leaderboard";
import RewardClaimModal from "@/components/RewardClaimModal";
import Header from "@/components/Header";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
});

export default function GamePage() {
  const { publicKey } = useWallet();
  const [currentScore, setCurrentScore] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  const handleGameOver = useCallback(
    async (score: number, duration: number) => {
      setCurrentScore(score);

      if (!publicKey) return;

      try {
        const response = await fetch("/api/submit-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: publicKey.toBase58(),
            score,
            duration,
            timestamp: Date.now(),
          }),
        });

        const data = await response.json();

        if (data.rank && data.rank <= 50) {
          setUserRank(data.rank);
          setShowClaimModal(true);
        }
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    },
    [publicKey]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20">
        <div className="w-full px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Image
                src="/garfield-coin.jpeg"
                alt=""
                width={64}
                height={64}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-garfield-yellow/40"
              />
              <div>
                <h1 className="text-3xl font-bold text-gradient">
                  Garfield Runner
                </h1>
                <p className="text-sm text-garfield-yellow font-semibold">
                  Daily Top 50 win merch 👕
                </p>
              </div>
            </div>
            <WalletButton />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <GameCanvas 
                key={publicKey?.toBase58() || "no-wallet"}
                onGameOver={handleGameOver} 
                walletConnected={!!publicKey} 
              />

              {currentScore > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-gradient">
                    Last Score: {currentScore}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:w-80">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>

      {userRank && (
        <RewardClaimModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          userRank={userRank}
        />
      )}
    </>
  );
}
