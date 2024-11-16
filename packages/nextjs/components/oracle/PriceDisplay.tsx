import { useEffect, useState } from "react";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const formatPrice = (rawPrice: bigint | undefined): string => {
  if (!rawPrice) return "0";

  // Convert from wei (18 decimals) to standard price
  // Convert bigint to string first, then to number to handle large values
  const priceInWei = rawPrice.toString();
  const price = Number(priceInWei) / Math.pow(10, 18);

  // Format based on price range
  if (price > 1000) {
    return price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else if (price > 1) {
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } else {
    return price.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
};

export const PriceDisplay = () => {
  const { data: contract } = useScaffoldContract({
    contractName: "OracleDataReader",
  });

  const [formattedPrices, setFormattedPrices] = useState({
    btc: "0",
    eth: "0",
    eur: "0",
  });

  useEffect(() => {
    const fetchPrices = async () => {
      if (!contract) return;

      try {
        const prices = await contract.read.getAllPrices();
        setFormattedPrices({
          btc: formatPrice(prices[0]),
          eth: formatPrice(prices[1]),
          eur: formatPrice(prices[2]),
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
    // Set up polling interval
    const interval = setInterval(fetchPrices, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [contract]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl mb-4">₿</div>
        <h3 className="text-xl font-bold mb-2">BTC/USD</h3>
        <p className="text-2xl font-bold text-primary">${formattedPrices.btc}</p>
      </div>

      <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl mb-4">Ξ</div>
        <h3 className="text-xl font-bold mb-2">ETH/USD</h3>
        <p className="text-2xl font-bold text-primary">${formattedPrices.eth}</p>
      </div>

      <div className="bg-base-100 p-8 rounded-xl shadow-lg text-center">
        <div className="text-4xl mb-4">€</div>
        <h3 className="text-xl font-bold mb-2">EUR/USD</h3>
        <p className="text-2xl font-bold text-primary">${formattedPrices.eur}</p>
      </div>
    </div>
  );
};
