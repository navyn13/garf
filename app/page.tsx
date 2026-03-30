import Image from "next/image";
import Header from "@/components/Header";
import Countdown from "@/components/Countdown";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <section id="home" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-garfield-yellow/30 to-garfield-orange/20 blur-2xl scale-110" />
            <Image
              src="/garfield-coin.jpeg"
              alt="Garfield Coin — Meme Coin"
              width={280}
              height={280}
              className="relative mx-auto h-48 w-48 md:h-72 md:w-72 rounded-full object-cover ring-4 ring-garfield-yellow/50 shadow-2xl shadow-black/50"
              priority
            />
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-gradient mb-6 text-center">
            $GARFIELD
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 text-center max-w-3xl">
            The laziest cat just entered the blockchain. Mondays are cancelled.
          </p>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-400">Launch countdown</h2>
            <Countdown />
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://x.com/garfieldcoqb"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
            >
              Join on X
            </a>
            <a
              href="https://t.co/frfHFzO8Ek"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
            >
              Discord
            </a>
            <a
              href="https://t.me/garfieldgateaway"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
            >
              Telegram
            </a>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-8">WTF is GARFIELD?</h2>
            <div className="text-xl text-gray-300 space-y-6 text-center">
              <p>
                Born from the laziest cat on the internet, $GARFIELD is the meme coin that hates effort but loves gains.
              </p>
              <p>
                No roadmap promises we can&apos;t keep. No VC overlords. Just pure, unfiltered community power and vibes on the blockchain.
              </p>
              <p className="text-2xl font-semibold text-gradient">
                This isn&apos;t just a token. It&apos;s a movement for everyone who ever wanted to moon while eating lasagna.
              </p>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-12">Tokenomics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-700 hover:border-garfield-orange transition-colors">
                <div className="text-5xl font-bold text-gradient mb-3">1B</div>
                <div className="text-gray-400 font-semibold">Total Supply</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-700 hover:border-garfield-orange transition-colors">
                <div className="text-5xl font-bold text-gradient mb-3">0%</div>
                <div className="text-gray-400 font-semibold">Tax</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-700 hover:border-garfield-orange transition-colors">
                <div className="text-5xl font-bold text-green-400 mb-3">Locked</div>
                <div className="text-gray-400 font-semibold">Liquidity</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-700 hover:border-garfield-orange transition-colors">
                <div className="text-5xl font-bold text-green-400 mb-3">Renounced</div>
                <div className="text-gray-400 font-semibold">Contract</div>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">Disclaimer</p>
          </div>
        </section>

        <section id="roadmap" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16">Roadmap</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-garfield-orange hover:scale-105 transition-transform">
                <h3 className="text-3xl font-bold text-gradient mb-3">Phase 1</h3>
                <h4 className="text-xl font-semibold mb-6 text-white">The Awakening</h4>
                <ul className="space-y-3 text-gray-300 text-left">
                  <li>✦ Website launch</li>
                  <li>✦ Social channels live</li>
                  <li>✦ Community building begins</li>
                  <li>✦ Meme factory activated</li>
                </ul>
              </div>
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-garfield-orange hover:scale-105 transition-all">
                <h3 className="text-3xl font-bold text-gradient mb-3">Phase 2</h3>
                <h4 className="text-xl font-semibold mb-6 text-white">The Launch</h4>
                <ul className="space-y-3 text-gray-300 text-left">
                  <li>✦ Token launch</li>
                  <li>✦ Game goes live</li>
                  <li>✦ Daily competitions</li>
                  <li>✦ Merch rewards</li>
                </ul>
              </div>
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-garfield-orange hover:scale-105 transition-all">
                <h3 className="text-3xl font-bold text-gradient mb-3">Phase 3</h3>
                <h4 className="text-xl font-semibold mb-6 text-white">The Takeover</h4>
                <ul className="space-y-3 text-gray-300 text-left">
                  <li>✦ CEX listings</li>
                  <li>✦ Partnerships</li>
                  <li>✦ Viral marketing</li>
                  <li>✦ Community events</li>
                </ul>
              </div>
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-garfield-orange hover:scale-105 transition-all">
                <h3 className="text-3xl font-bold text-gradient mb-3">Phase 4</h3>
                <h4 className="text-xl font-semibold mb-6 text-white">The Lasagna Era</h4>
                <ul className="space-y-3 text-gray-300 text-left">
                  <li>✦ Metaverse integration</li>
                  <li>✦ NFT collection</li>
                  <li>✦ DAO governance</li>
                  <li>✦ Moon mission 🚀</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Join the Pack</h2>
            <p className="text-2xl text-gray-300 mb-12">
              The $GARFIELD army is growing. Don&apos;t miss out on the laziest revolution in crypto.
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="https://x.com/garfieldcoqb"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-xl"
              >
                Follow on X
              </a>
              <a
                href="https://t.co/frfHFzO8Ek"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-xl"
              >
                Join Discord
              </a>
              <a
                href="https://t.me/garfieldgateaway"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-gradient-to-r from-garfield-yellow to-garfield-orange text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-xl"
              >
                Join Telegram
              </a>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm py-12 border-t border-gray-800">
          <p>Disclaimer: This is a meme coin. Do your own research. Not financial advice.</p>
        </footer>
      </main>
    </>
  );
}
