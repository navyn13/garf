"use client";

import { WalletProvider } from "@/components/WalletProvider";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProvider>{children}</WalletProvider>;
}
