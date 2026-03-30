"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import GarfieldGame from "@/game/GarfieldGame";

interface GameCanvasProps {
  onGameOver: (score: number, duration: number) => void;
  walletConnected: boolean;
}

export default function GameCanvas({ onGameOver, walletConnected }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  const handlePlayAgain = () => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene("GarfieldGame") as GarfieldGame;
      if (scene) {
        scene.scene.restart();
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current || !walletConnected) return;
    if (gameRef.current) return;
    if (initializingRef.current) return;

    initializingRef.current = true;
    setIsLoading(true);

    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight - 200;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: gameWidth,
      height: gameHeight,
      parent: containerRef.current,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: GarfieldGame,
      backgroundColor: "#87CEEB",
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    try {
      gameRef.current = new Phaser.Game(config);
      
      const checkScene = setInterval(() => {
        if (gameRef.current) {
          const scene = gameRef.current.scene.getScene("GarfieldGame") as GarfieldGame;
          if (scene && scene.sys) {
            scene.init({ 
              onGameOver: (score: number, duration: number) => {
                onGameOverRef.current(score, duration);
              },
              onPlayAgain: handlePlayAgain
            });
            
            scene.load.on('complete', () => {
              setIsLoading(false);
            });
            
            if (scene.textures.exists('garfield') && scene.textures.exists('coin')) {
              setIsLoading(false);
            }
            
            setGameStarted(true);
            initializingRef.current = false;
            clearInterval(checkScene);
          }
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkScene);
        if (!gameStarted) {
          initializingRef.current = false;
        }
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to initialize game:", error);
      initializingRef.current = false;
      setIsLoading(false);
    }

    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true, false);
        } catch (e) {
          console.error("Error destroying game:", e);
        }
        gameRef.current = null;
        setGameStarted(false);
        setIsLoading(true);
        initializingRef.current = false;
      }
    };
  }, [walletConnected]);

  if (!walletConnected) {
    return (
      <div className="w-full h-[calc(100vh-200px)] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-2xl text-gray-400">Connect your wallet to play</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && walletConnected && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mb-4"></div>
            <p className="text-2xl text-yellow-400 font-bold">Loading Game Assets...</p>
            <p className="text-lg text-gray-300 mt-2">Preparing your adventure!</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="rounded-lg overflow-hidden shadow-2xl w-full" />
    </div>
  );
}
