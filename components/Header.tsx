"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Garfield Coin — Home"
          >
            <Image
              src="/garfield-coin.jpeg"
              alt=""
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-garfield-yellow/40 shadow-lg shadow-garfield-orange/20"
              priority
            />
            <span className="text-xl md:text-2xl font-black text-gradient">
              GARFIELD COIN
            </span>
          </Link>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("tokenomics")}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Tokenomics
            </button>
            <button
              onClick={() => scrollToSection("roadmap")}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Roadmap
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="text-gray-300 hover:text-white transition-colors font-semibold"
            >
              Community
            </button>
            <Link
              href="/game"
              className="px-6 py-2 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              🎮 Play Game
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors font-semibold py-2"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors font-semibold py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("tokenomics")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors font-semibold py-2"
            >
              Tokenomics
            </button>
            <button
              onClick={() => scrollToSection("roadmap")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors font-semibold py-2"
            >
              Roadmap
            </button>
            <button
              onClick={() => scrollToSection("community")}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors font-semibold py-2"
            >
              Community
            </button>
            <Link
              href="/game"
              className="block text-center px-6 py-2 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold rounded-lg"
            >
              🎮 Play Game
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
