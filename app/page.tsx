import Image from "next/image";
import { Inter } from "next/font/google";
import LaunchCountdown from "@/components/launch-countdown";

const inter = Inter({ subsets: ["latin"] });

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#community", label: "Community" },
];

const features = [
  {
    title: "Ultra-Low Friction",
    description: "No tax, no hidden rules, no complex onboarding. Built for simple entry and smooth participation.",
    className: "md:col-span-2",
  },
  {
    title: "Community First",
    description: "Transparent communication and open discussion channels where holders help shape the culture.",
    className: "md:row-span-2",
  },
  {
    title: "Verified Liquidity",
    description: "Liquidity is locked to maintain trust and reduce uncertainty for new participants.",
    className: "",
  },
  {
    title: "Renounced Contract",
    description: "Contract ownership is renounced, lowering the risk of surprise administrative changes.",
    className: "",
  },
  {
    title: "Built to Scale",
    description: "Landing experience optimized for performance and clarity across mobile, tablet, and desktop.",
    className: "md:col-span-2",
  },
];

export default function Home() {
  return (
    <div className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-100`}>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/60">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        >
          <a href="#home" className="text-sm font-semibold tracking-wide text-white">
            GARFIELD
          </a>
          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-neutral-300 transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#community"
            aria-label="Join Garfield community"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Join Now
          </a>
          <a
            href="/game"
            aria-label="Play Garfield game"
            className="rounded-full bg-garfield-orange px-4 py-2 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-garfield-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garfield-orange focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            Play Game
          </a>
        </nav>
      </header>

      <main>
        <section id="home" className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-neutral-200">
                Meme energy, modern execution
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                The clean, community-driven way to explore <span className="text-garfield-orange">$GARFIELD</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                A minimalist ecosystem with transparent tokenomics, strong community signals, and a frictionless landing
                experience from first click to first follow.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/game"
                  aria-label="Play Garfield game now"
                  className="rounded-full bg-garfield-orange px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-garfield-orange/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garfield-orange focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Play Game
                </a>
                <a
                  href="#tokenomics"
                  aria-label="View tokenomics details"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  View Tokenomics
                </a>
                <a
                  href="#features"
                  aria-label="Learn more about project features"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Explore Features
                </a>
              </div>
              <LaunchCountdown />
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-2 rounded-[2rem] bg-garfield-orange/20 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-[2rem] border border-white/10 bg-neutral-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
                <Image
                  src="/garfield-coin.jpeg"
                  alt="Garfield coin artwork"
                  width={480}
                  height={480}
                  priority
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl space-y-3">
            <h2 id="features-heading" className="text-3xl font-semibold text-white sm:text-4xl">
              Designed for clarity and trust
            </h2>
            <p className="text-neutral-300">
              A clean bento layout with focused information hierarchy and smooth micro-interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className={`${feature.className} group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 shadow-sm shadow-black/20 transition-all duration-250 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/40`}
              >
                <h3 className="mb-3 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="tokenomics" aria-labelledby="tokenomics-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl space-y-3">
            <h2 id="tokenomics-heading" className="text-3xl font-semibold text-white sm:text-4xl">
              Transparent tokenomics
            </h2>
            <p className="text-neutral-300">Straightforward structure with readable metrics and high-contrast values.</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 md:p-6">
              <dt className="text-sm text-neutral-400">Total Supply</dt>
              <dd className="mt-2 text-3xl font-semibold text-white">1B</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 md:p-6">
              <dt className="text-sm text-neutral-400">Tax</dt>
              <dd className="mt-2 text-3xl font-semibold text-white">0%</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 md:p-6">
              <dt className="text-sm text-neutral-400">Liquidity</dt>
              <dd className="mt-2 text-3xl font-semibold text-white">Locked</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-5 md:p-6">
              <dt className="text-sm text-neutral-400">Contract</dt>
              <dd className="mt-2 text-3xl font-semibold text-white">Renounced</dd>
            </div>
          </dl>
        </section>

        <section id="community" className="mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-neutral-900/70 px-6 py-12 sm:px-10">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Join the Garfield community</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
              Stay close to announcements, campaigns, and community updates across every channel.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="https://x.com/garfieldcoqb"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Garfield X profile"
                className="rounded-full bg-garfield-orange px-5 py-2.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-garfield-orange/40"
              >
                Follow on X
              </a>
              <a
                href="https://t.co/frfHFzO8Ek"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Garfield Discord invite"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Join Discord
              </a>
              <a
                href="https://t.me/garfieldgateaway"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Garfield Telegram"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Join Telegram
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
