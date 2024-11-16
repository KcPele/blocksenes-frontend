"use client";

import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { PriceDisplay } from "~~/components/oracle/PriceDisplay";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-gradient-to-br from-base-100 to-base-300">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BlockSense Oracle Network
            </h1>
            <p className="text-2xl mb-8 text-base-content/80">
              Empowering DeFi with Real-Time, Decentralized Price Feeds
            </p>

            {/* Price Display Component */}
            <div className="mb-8">
              <PriceDisplay />
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/trading-simulator" className="btn btn-primary btn-lg">
                Try Trading Simulator
              </Link>
              <Link href="/oracle" className="btn btn-outline btn-lg">
                View All Feeds
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="bg-base-200 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Latest Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-base-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">New Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-primary" />
                  Interactive Trading Simulator Launch
                </li>
                <li className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                  Real-time Price Charts
                </li>
                <li className="flex items-center gap-2">
                  <ScaleIcon className="h-5 w-5 text-primary" />
                  Portfolio Management Tools
                </li>
              </ul>
            </div>
            <div className="bg-base-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Network Stats</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Update Frequency:</span>
                  <span className="font-bold">30 seconds</span>
                </li>
                <li className="flex justify-between">
                  <span>Network Status:</span>
                  <span className="text-success font-bold">Active</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Price Feeds:</span>
                  <span className="font-bold">3 and growing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose BlockSense?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <ArrowTrendingUpIcon className="h-12 w-12 text-primary mb-4" />
              <h2 className="card-title">Real-Time Updates</h2>
              <p>Lightning-fast price updates every 30 seconds from trusted sources</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <ShieldCheckIcon className="h-12 w-12 text-secondary mb-4" />
              <h2 className="card-title">Secure & Reliable</h2>
              <p>Built on blockchain technology ensuring data integrity and availability</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <CubeTransparentIcon className="h-12 w-12 text-accent mb-4" />
              <h2 className="card-title">Transparent</h2>
              <p>Open-source infrastructure with verifiable price feeds</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              <CircleStackIcon className="h-12 w-12 text-info mb-4" />
              <h2 className="card-title">Multi-Asset</h2>
              <p>Supporting crypto, forex, and commodity price feeds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-bold mb-2">DeFi Protocols</h3>
              <p>Power your lending, borrowing, and trading platforms with reliable price feeds</p>
            </div>

            <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Smart Contracts</h3>
              <p>Build automated financial instruments with trusted price data</p>
            </div>

            <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p>Access historical price data for market analysis and research</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-base-100 rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Easy Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Integrate BlockSense Oracle into your DApp with just a few lines of code. Our smart contracts are
                audited, well-documented, and ready for production use.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="h-6 w-6 text-primary" />
                  <span>Multiple networks supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-6 w-6 text-primary" />
                  <span>Gas-efficient design</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-6 w-6 text-primary" />
                  <span>Security-first approach</span>
                </div>
              </div>
            </div>
            <div className="bg-base-300 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                <code>{`// Example Integration
const price = await oracle.readPriceFromFeed(
  oracle.BTC_USD_FEED
);

console.log("BTC Price:", price);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 text-center text-primary-content">
          <h2 className="text-3xl font-bold mb-4">Experience the Future of Oracle Networks</h2>
          <p className="mb-8 text-xl">Try our interactive trading simulator powered by real-time price feeds</p>
          <Link href="/trading-simulator" className="btn btn-lg glass">
            Launch Trading Simulator
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
