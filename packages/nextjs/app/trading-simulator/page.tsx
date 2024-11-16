"use client";

import { useEffect, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Portfolio {
  btc: number;
  eth: number;
  usd: number;
}

interface PriceHistory {
  btc: number[];
  eth: number[];
  timestamps: string[];
}

const TradingSimulator = () => {
  const { data: contract } = useScaffoldContract({
    contractName: "OracleDataReader",
  });

  const [portfolio, setPortfolio] = useState<Portfolio>({ btc: 0, eth: 0, usd: 10000 });
  const [currentPrices, setCurrentPrices] = useState({ btc: 0, eth: 0 });
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({
    btc: [],
    eth: [],
    timestamps: [],
  });
  const [totalValue, setTotalValue] = useState(10000);
  const [tradeAmount, setTradeAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<"btc" | "eth">("btc");

  // Fetch prices and update history
  useEffect(() => {
    const fetchPrices = async () => {
      if (!contract) return;

      try {
        const prices = await contract.read.getAllPrices();
        const btcPrice = Number(prices[0]) / Math.pow(10, 18);
        const ethPrice = Number(prices[1]) / Math.pow(10, 18);

        setCurrentPrices({ btc: btcPrice, eth: ethPrice });

        // Update price history
        setPriceHistory(prev => ({
          btc: [...prev.btc.slice(-11), btcPrice],
          eth: [...prev.eth.slice(-11), ethPrice],
          timestamps: [...prev.timestamps.slice(-11), new Date().toLocaleTimeString()],
        }));

        // Calculate total portfolio value
        const newTotalValue = portfolio.usd + portfolio.btc * btcPrice + portfolio.eth * ethPrice;
        setTotalValue(newTotalValue);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [contract, portfolio]);

  const handleTrade = (type: "buy" | "sell") => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;

    const price = currentPrices[selectedCrypto];
    const totalCost = amount * price;

    if (type === "buy") {
      if (totalCost > portfolio.usd) return;
      setPortfolio(prev => ({
        ...prev,
        [selectedCrypto]: prev[selectedCrypto] + amount,
        usd: prev.usd - totalCost,
      }));
    } else {
      if (amount > portfolio[selectedCrypto]) return;
      setPortfolio(prev => ({
        ...prev,
        [selectedCrypto]: prev[selectedCrypto] - amount,
        usd: prev.usd + totalCost,
      }));
    }
    setTradeAmount("");
  };

  const chartData = {
    labels: priceHistory.timestamps,
    datasets: [
      {
        label: "BTC/USD",
        data: priceHistory.btc,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        fill: true,
      },
      {
        label: "ETH/USD",
        data: priceHistory.eth,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Crypto Trading Simulator</h1>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">USD Balance</h3>
          <p className="text-2xl font-bold">${portfolio.usd.toLocaleString()}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">BTC Holdings</h3>
          <p className="text-2xl font-bold">{portfolio.btc.toFixed(4)} BTC</p>
          <p className="text-sm">${(portfolio.btc * currentPrices.btc).toLocaleString()}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">ETH Holdings</h3>
          <p className="text-2xl font-bold">{portfolio.eth.toFixed(4)} ETH</p>
          <p className="text-sm">${(portfolio.eth * currentPrices.eth).toLocaleString()}</p>
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-base-100 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Price History</h2>
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Trade</h2>
          <div className="space-y-4">
            <select
              className="select select-bordered w-full"
              value={selectedCrypto}
              onChange={e => setSelectedCrypto(e.target.value as "btc" | "eth")}
            >
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              className="input input-bordered w-full"
              value={tradeAmount}
              onChange={e => setTradeAmount(e.target.value)}
            />
            <div className="flex gap-4">
              <button className="btn btn-success flex-1" onClick={() => handleTrade("buy")}>
                Buy
              </button>
              <button className="btn btn-error flex-1" onClick={() => handleTrade("sell")}>
                Sell
              </button>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Live Prices</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">BTC/USD</span>
              <div className="flex items-center">
                <span className="text-xl font-bold">${currentPrices.btc.toLocaleString()}</span>
                <ArrowTrendingUpIcon className="h-5 w-5 text-success ml-2" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg">ETH/USD</span>
              <div className="flex items-center">
                <span className="text-xl font-bold">${currentPrices.eth.toLocaleString()}</span>
                <ArrowTrendingDownIcon className="h-5 w-5 text-error ml-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSimulator;
