import type { Metadata } from "next";
import "./globals.css";
import "./wallet-adapter.css";

export const metadata: Metadata = {
  title: "GARFIELD COIN - The Laziest Meme Coin",
  description: "The laziest cat just entered the blockchain. Mondays are cancelled.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
