"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon, BellAlertIcon, ChartBarSquareIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const AdvancedFeatures = () => {
  const { data: contract } = useScaffoldContract({
    contractName: "OracleDataReader",
  });

  const [selectedFeed, setSelectedFeed] = useState("BTC_USD_FEED");
  const [alertPrices, setAlertPrices] = useState({ upper: "", lower: "" });
  const [priceHistory, setPriceHistory] = useState<string[]>([]);
  const [averagePrice, setAveragePrice] = useState<string>("0");
  const [volatility, setVolatility] = useState<string>("0");
  const [alerts, setAlerts] = useState<Array<{ price: string; isUpper: boolean }>>([]);

  const feeds = {
    BTC_USD_FEED: "0x8000001f",
    ETH_USD_FEED: "0x8000002f",
    EUR_USD_FEED: "0x800000fd",
  };

  const formatPrice = (price: bigint | undefined) => {
    if (!price) return "0";
    return (Number(price.toString()) / Math.pow(10, 18)).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      if (!contract) return;

      try {
        // Get average price
        const avg = await contract.read.getAveragePrice([feeds[selectedFeed as keyof typeof feeds]]);
        setAveragePrice(formatPrice(avg));

        // Get volatility
        const vol = await contract.read.getPriceVolatility([feeds[selectedFeed as keyof typeof feeds]]);
        setVolatility(formatPrice(vol));

        // Update and fetch price history
        await contract.simulate.updatePriceHistory([feeds[selectedFeed as keyof typeof feeds]]);

        // Get the price history array
        const historyLength = 10; // MAX_HISTORY_LENGTH from contract
        const prices: string[] = [];
        for (let i = 0; i < historyLength; i++) {
          try {
            const price = await contract.read.priceHistory([feeds[selectedFeed as keyof typeof feeds], i]);
            if (price > 0n) {
              prices.push(formatPrice(price));
            }
          } catch (error) {
            break; // Break if we've reached the end of the history
          }
        }
        setPriceHistory(prices);

        // Check alerts
        const alertsResult = await contract.read.checkAllPriceAlerts();
        if (alertsResult) {
          const currentPrice = await contract.read.readPriceFromFeed([feeds[selectedFeed as keyof typeof feeds]]);

          // Only add new alerts
          setAlerts(prev => {
            const newAlert = {
              price: formatPrice(currentPrice),
              isUpper: true, // You might want to determine this based on the alert type
            };
            return [...prev.slice(-4), newAlert]; // Keep last 5 alerts
          });
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    };

    fetchPriceData();
    const interval = setInterval(fetchPriceData, 30000);
    return () => clearInterval(interval);
  }, [contract, selectedFeed]);

  const handleSetPriceAlert = async () => {
    if (!contract || !alertPrices.upper || !alertPrices.lower) return;

    try {
      const upper = BigInt(parseFloat(alertPrices.upper) * Math.pow(10, 18));
      const lower = BigInt(parseFloat(alertPrices.lower) * Math.pow(10, 18));

      await contract.simulate.setPriceAlert([feeds[selectedFeed as keyof typeof feeds], upper, lower]);

      setAlertPrices({ upper: "", lower: "" });
    } catch (error) {
      console.error("Error setting price alert:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Advanced Oracle Features</h1>

      {/* Feed Selector */}
      <div className="mb-8">
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedFeed}
          onChange={e => setSelectedFeed(e.target.value)}
        >
          <option value="BTC_USD_FEED">Bitcoin (BTC/USD)</option>
          <option value="ETH_USD_FEED">Ethereum (ETH/USD)</option>
          <option value="EUR_USD_FEED">Euro (EUR/USD)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Price Alerts Section */}
        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BellAlertIcon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Price Alerts</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Upper Price Alert ($)</label>
              <input
                type="number"
                placeholder="Upper price threshold"
                className="input input-bordered w-full"
                value={alertPrices.upper}
                onChange={e => setAlertPrices(prev => ({ ...prev, upper: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Lower Price Alert ($)</label>
              <input
                type="number"
                placeholder="Lower price threshold"
                className="input input-bordered w-full"
                value={alertPrices.lower}
                onChange={e => setAlertPrices(prev => ({ ...prev, lower: e.target.value }))}
              />
            </div>
            <button className="btn btn-primary w-full" onClick={handleSetPriceAlert}>
              Set Alert
            </button>
          </div>
          {/* Alert History */}
          <div className="mt-4">
            <h3 className="font-bold mb-2">Recent Alerts</h3>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className={`text-sm ${alert.isUpper ? "text-success" : "text-error"}`}>
                  Price {alert.isUpper ? "above" : "below"} threshold: ${alert.price}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Analytics Section */}
        <div className="bg-base-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarSquareIcon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Price Analytics</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Average Price:</span>
                <span className="font-bold">${averagePrice}</span>
              </div>
            </div>
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Price Volatility:</span>
                <span className="font-bold">${volatility}</span>
              </div>
            </div>
          </div>
          {/* Price History */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="h-5 w-5" />
              <h3 className="font-bold">Price History</h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {priceHistory.length > 0 ? (
                priceHistory.map((price, index) => (
                  <div key={index} className="flex justify-between text-sm bg-base-200 p-2 rounded">
                    <span>
                      {new Date(Date.now() - (priceHistory.length - 1 - index) * 300000).toLocaleTimeString()}
                    </span>
                    <span className="font-medium">${price}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-base-content/70">No price history available yet</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update All Data button */}
      <div className="mt-8 text-center">
        <button className="btn btn-secondary gap-2" onClick={() => contract?.simulate.updateAllPriceHistories()}>
          <ArrowPathIcon className="h-5 w-5" />
          Update All Data
        </button>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
