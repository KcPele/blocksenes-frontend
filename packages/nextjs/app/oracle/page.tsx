"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowPathIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { PriceDisplay } from "~~/components/oracle/PriceDisplay";

const OraclePage = () => {
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString());
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <div className="bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Price Oracle</h1>
              <p className="text-base-content/70">Real-time decentralized price feeds from multiple sources</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="text-sm text-base-content/70">Last Update: {lastUpdate}</span>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Price Cards */}
        <div className="mb-12">
          <PriceDisplay />
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-base-100 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Market Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>24h Volume</span>
                <span className="font-bold">$42.8B</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Market Cap</span>
                <span className="font-bold">$2.1T</span>
              </div>
              <div className="flex items-center justify-between">
                <span>BTC Dominance</span>
                <span className="font-bold">48.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">24h Price Change</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Bitcoin</span>
                <div className="flex items-center text-success">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>+2.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Ethereum</span>
                <div className="flex items-center text-error">
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  <span>-1.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>EUR/USD</span>
                <div className="flex items-center text-success">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span>+0.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-base-100 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Oracle Network Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Update Frequency</h3>
              <p className="text-base-content/70">Prices are updated every 30 seconds</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Sources</h3>
              <p className="text-base-content/70">Aggregated from multiple trusted sources</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Network Status</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-success">Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <Link href="/debug" className="btn btn-primary btn-lg">
            Explore Smart Contract
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OraclePage;
