// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IUpgradeableProxy {
    fallback(bytes calldata) external returns (bytes memory);
}

contract OracleDataReader {
    IUpgradeableProxy public immutable proxyContract;

    // Feed IDs from config/feeds_config.json (using hex values directly)
    bytes4 public constant BTC_USD_FEED = 0x8000001f;
    bytes4 public constant ETH_USD_FEED = 0x8000002f;
    bytes4 public constant EUR_USD_FEED = 0x800000fd;

    // Price alert thresholds
    mapping(address => mapping(bytes4 => uint256)) public upperPriceAlerts;
    mapping(address => mapping(bytes4 => uint256)) public lowerPriceAlerts;

    // Historical price tracking
    mapping(bytes4 => uint256[]) public priceHistory;
    mapping(bytes4 => uint256) public lastUpdateTime;
    uint256 public constant MAX_HISTORY_LENGTH = 10;

    // Trading pairs status
    mapping(bytes4 => bool) public activePairs;

    // Events
    event PriceRead(uint256 indexed feedId, uint256 price);
    event PriceAlert(
        address indexed user,
        bytes4 indexed feed,
        uint256 price,
        bool isUpperAlert
    );
    event PriceHistoryUpdated(
        bytes4 indexed feed,
        uint256 price,
        uint256 timestamp
    );
    event TradingPairStatusChanged(bytes4 indexed feed, bool isActive);

    constructor(address _proxyAddress) {
        require(_proxyAddress != address(0), "Invalid proxy address");
        proxyContract = IUpgradeableProxy(_proxyAddress);

        // Initialize active pairs
        activePairs[BTC_USD_FEED] = true;
        activePairs[ETH_USD_FEED] = true;
        activePairs[EUR_USD_FEED] = true;
    }

    function readPriceFromFeed(bytes4 feedId) public view returns (uint256) {
        require(activePairs[feedId], "Trading pair is not active");
        (bool success, bytes memory data) = address(proxyContract).staticcall(
            abi.encodePacked(feedId)
        );
        require(success, "Call failed");

        uint256 price;
        assembly {
            price := shr(64, mload(add(data, 32)))
        }

        return price;
    }

    function getBtcUsdPrice() external view returns (uint256) {
        return readPriceFromFeed(BTC_USD_FEED);
    }

    function getEthUsdPrice() external view returns (uint256) {
        return readPriceFromFeed(ETH_USD_FEED);
    }

    function getEurUsdPrice() external view returns (uint256) {
        return readPriceFromFeed(EUR_USD_FEED);
    }

    function getAllPrices() external view returns (uint256[3] memory) {
        return [
            readPriceFromFeed(BTC_USD_FEED),
            readPriceFromFeed(ETH_USD_FEED),
            readPriceFromFeed(EUR_USD_FEED)
        ];
    }

    // Price Alert System
    function setPriceAlert(
        bytes4 feedId,
        uint256 upperPrice,
        uint256 lowerPrice
    ) external {
        require(activePairs[feedId], "Trading pair is not active");
        require(
            upperPrice > lowerPrice,
            "Upper price must be greater than lower price"
        );

        upperPriceAlerts[msg.sender][feedId] = upperPrice;
        lowerPriceAlerts[msg.sender][feedId] = lowerPrice;
    }

    function checkPriceAlerts(bytes4 feedId) public returns (bool) {
        uint256 currentPrice = readPriceFromFeed(feedId);
        uint256 upperAlert = upperPriceAlerts[msg.sender][feedId];
        uint256 lowerAlert = lowerPriceAlerts[msg.sender][feedId];

        if (upperAlert > 0 && currentPrice >= upperAlert) {
            emit PriceAlert(msg.sender, feedId, currentPrice, true);
            return true;
        }
        if (lowerAlert > 0 && currentPrice <= lowerAlert) {
            emit PriceAlert(msg.sender, feedId, currentPrice, false);
            return true;
        }
        return false;
    }

    // Price History Tracking
    function updatePriceHistory(bytes4 feedId) public {
        uint256 currentPrice = readPriceFromFeed(feedId);
        uint256 currentTime = block.timestamp;

        // Only update if enough time has passed (e.g., 5 minutes)
        if (currentTime >= lastUpdateTime[feedId] + 5 minutes) {
            if (priceHistory[feedId].length >= MAX_HISTORY_LENGTH) {
                // Remove oldest price
                for (uint i = 0; i < priceHistory[feedId].length - 1; i++) {
                    priceHistory[feedId][i] = priceHistory[feedId][i + 1];
                }
                priceHistory[feedId][MAX_HISTORY_LENGTH - 1] = currentPrice;
            } else {
                priceHistory[feedId].push(currentPrice);
            }

            lastUpdateTime[feedId] = currentTime;
            emit PriceHistoryUpdated(feedId, currentPrice, currentTime);
        }
    }

    // Price Analysis Functions
    function getAveragePrice(bytes4 feedId) public view returns (uint256) {
        require(priceHistory[feedId].length > 0, "No price history available");
        uint256 sum = 0;
        for (uint i = 0; i < priceHistory[feedId].length; i++) {
            sum += priceHistory[feedId][i];
        }
        return sum / priceHistory[feedId].length;
    }

    function getPriceVolatility(bytes4 feedId) public view returns (uint256) {
        require(priceHistory[feedId].length > 1, "Insufficient price history");
        uint256 avg = getAveragePrice(feedId);
        uint256 sumSquaredDiff = 0;

        for (uint i = 0; i < priceHistory[feedId].length; i++) {
            uint256 diff = priceHistory[feedId][i] > avg
                ? priceHistory[feedId][i] - avg
                : avg - priceHistory[feedId][i];
            sumSquaredDiff += diff * diff;
        }

        return sqrt(sumSquaredDiff / priceHistory[feedId].length);
    }

    // Utility function for square root calculation
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    // Admin Functions
    function setTradingPairStatus(bytes4 feedId, bool isActive) external {
        // In production, add access control
        activePairs[feedId] = isActive;
        emit TradingPairStatusChanged(feedId, isActive);
    }

    // Batch Operations
    function checkAllPriceAlerts() external returns (bool[] memory) {
        bytes4[] memory feeds = new bytes4[](3);
        feeds[0] = BTC_USD_FEED;
        feeds[1] = ETH_USD_FEED;
        feeds[2] = EUR_USD_FEED;

        bool[] memory alerts = new bool[](3);
        for (uint i = 0; i < feeds.length; i++) {
            if (activePairs[feeds[i]]) {
                alerts[i] = checkPriceAlerts(feeds[i]);
            }
        }
        return alerts;
    }

    function updateAllPriceHistories() external {
        if (activePairs[BTC_USD_FEED]) updatePriceHistory(BTC_USD_FEED);
        if (activePairs[ETH_USD_FEED]) updatePriceHistory(ETH_USD_FEED);
        if (activePairs[EUR_USD_FEED]) updatePriceHistory(EUR_USD_FEED);
    }
}
