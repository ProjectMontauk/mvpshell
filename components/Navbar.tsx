"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { client } from "../src/client";
import { useRouter, usePathname } from "next/navigation";
import { tokenContract, getContractsForMarket } from "../constants/contracts";
import { inAppWallet } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { readContract } from "thirdweb";
import { usePortfolio } from "../src/contexts/PortfolioContext";
import DenariusSymbol from "../src/components/DenariusSymbolInline";

// TODO: Replace this with the actual ThirdWeb inAppWallet import
// import { InAppWalletButton } from "thirdweb-package-path";

// Add Trade type based on schema.prisma
/*
interface Trade {
  id: number;
  walletAddress: string;
  marketTitle: string;
  marketId: string;
  outcome: string;
  shares: number;
  avgPrice: number;
  betAmount: number;
  toWin: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
*/

// Interface for current positions
interface CurrentPosition {
  marketId: string;
  marketTitle: string;
  outcome: string;
  shares: number;
  currentPrice: number;
  positionValue: number;
}

function formatBalance(balance: bigint | undefined): string {
  if (!balance) return "0";
  // Divide by 10^18 and show decimal places only when needed
  const amount = Number(balance) / 1e18;
  return amount % 1 === 0
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const account = useActiveAccount();
  const { portfolioValue, setPortfolioValue } = usePortfolio();
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    data: balance,
    isPending,
    refetch,
  } = useReadContract({
    contract: tokenContract,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [account?.address ?? "0x0000000000000000000000000000000000000000"],
  });

  // Debug balance changes
  useEffect(() => {
    if (account?.address) {
      console.log("Navbar balance debug:", {
        account: account.address,
        balance: balance?.toString(),
        balanceNumber: balance ? Number(balance) / 1e18 : "undefined",
        isPending,
      });
    }
  }, [account?.address, balance, isPending]);

  const isDevelopment = process.env.NODE_ENV !== "production";

  // Function to get button styling based on current path
  const getButtonStyling = (route: string) => {
    const isActive =
      pathname === route ||
      (route === "/markets" && pathname.startsWith("/markets/")) ||
      (route === "/market-ideas" && pathname === "/market-ideas");

    return isActive
      ? "border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  };

  // Function to get mobile menu item styling
  const getMobileButtonStyling = (route: string) => {
    const isActive =
      pathname === route ||
      (route === "/markets" && pathname.startsWith("/markets/")) ||
      (route === "/market-ideas" && pathname === "/market-ideas");

    return isActive
      ? "block px-3 py-2 text-base font-medium text-blue-600 bg-blue-50 border-l-4 border-blue-500"
      : "block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50";
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle mobile navigation
  const handleMobileNavigation = (route: string) => {
    router.push(route);
    setIsMobileMenuOpen(false);
  };

  const wallets = isDevelopment
    ? [
        inAppWallet({
          auth: {
            options: ["google", "apple", "email", "phone", "passkey"] as const,
          },
          smartAccount: {
            chain: base,
            sponsorGas: true,
          },
        }),
      ]
    : [
        inAppWallet({
          auth: {
            options: ["google", "apple", "email", "phone"] as const,
          },
          smartAccount: {
            chain: base,
            sponsorGas: true,
          },
        }),
      ];

  // Polling mechanism for cash balance updates
  useEffect(() => {
    if (!account?.address) return;

    // Initial fetch
    refetch();

    // Set up polling interval (check every 3 seconds)
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    // Cleanup interval on unmount or account change
    return () => clearInterval(interval);
  }, [account?.address, refetch]);

  // Fetch current positions across all markets (same method as portfolio page)
  const fetchCurrentPositions = useCallback(async () => {
    if (!account?.address) {
      return [];
    }

    try {
      const positions: CurrentPosition[] = [];
      const { getAllMarkets } = await import("../src/data/markets");
      const markets = getAllMarkets();

      for (const market of markets) {
        try {
          const {
            conditionalTokensContract,
            outcome1PositionId,
            outcome2PositionId,
          } = getContractsForMarket(market.id);

          // Fetch Yes shares balance
          const yesBalance = await readContract({
            contract: conditionalTokensContract,
            method:
              "function balanceOf(address account, uint256 id) view returns (uint256)",
            params: [
              account.address as `0x${string}`,
              BigInt(outcome1PositionId),
            ],
          });

          // Fetch No shares balance
          const noBalance = await readContract({
            contract: conditionalTokensContract,
            method:
              "function balanceOf(address account, uint256 id) view returns (uint256)",
            params: [
              account.address as `0x${string}`,
              BigInt(outcome2PositionId),
            ],
          });

          // Convert to real numbers (divide by 10^18)
          const yesShares = Number(yesBalance) / 1e18;
          const noShares = Number(noBalance) / 1e18;

          // Get current odds for this market
          const { marketContract } = getContractsForMarket(market.id);
          const oddsYes = await readContract({
            contract: marketContract,
            method: "function odds(uint256 _outcome) view returns (int128)",
            params: [0n],
          });
          const oddsNo = await readContract({
            contract: marketContract,
            method: "function odds(uint256 _outcome) view returns (int128)",
            params: [1n],
          });

          const currentPriceYes = Number(oddsYes) / Math.pow(2, 64);
          const currentPriceNo = Number(oddsNo) / Math.pow(2, 64);

          // Add Yes position if user has shares
          if (yesShares > 0) {
            positions.push({
              marketId: market.id,
              marketTitle: market.title,
              outcome: market.outcomes[0], // Yes outcome
              shares: yesShares,
              currentPrice: currentPriceYes,
              positionValue: yesShares * currentPriceYes,
            });
          }

          // Add No position if user has shares
          if (noShares > 0) {
            positions.push({
              marketId: market.id,
              marketTitle: market.title,
              outcome: market.outcomes[1], // No outcome
              shares: noShares,
              currentPrice: currentPriceNo,
              positionValue: noShares * currentPriceNo,
            });
          }
        } catch (error) {
          console.error(
            `Failed to fetch positions for market ${market.id}:`,
            error
          );
        }
      }

      return positions;
    } catch (error) {
      console.error("Failed to fetch current positions:", error);
      return [];
    }
  }, [account?.address]);

  // Fetch and calculate portfolio value using current positions (same as portfolio page)
  useEffect(() => {
    const loadPortfolioValue = async () => {
      if (!account?.address) {
        setPortfolioValue("--");
        setPortfolioLoading(false);
        return;
      }
      // Check if we already have a valid portfolio value from global state
      const hasValidValue =
        portfolioValue !== "--" && !isNaN(Number(portfolioValue));
      // Only show loading and fetch new data if we don't have a valid value
      if (!hasValidValue) {
        setPortfolioLoading(true);
      }
      try {
        const cash = balance ? Number(balance) / 1e18 : 0;
        // Fetch current positions using the same method as portfolio page
        const currentPositions = await fetchCurrentPositions();
        // Calculate total positions value using current positions
        const totalPositionsValue = currentPositions.reduce(
          (sum, position) => sum + position.positionValue,
          0
        );
        const totalPortfolio = cash + totalPositionsValue;
        const newPortfolioValue = totalPortfolio.toFixed(2);
        // Only update if the value has actually changed
        if (newPortfolioValue !== portfolioValue) {
          setPortfolioValue(newPortfolioValue);
        }
        setPortfolioLoading(false);
      } catch (error) {
        console.error("Failed to load portfolio value:", error);
        setPortfolioValue("--");
        setPortfolioLoading(false);
      }
    };
    loadPortfolioValue();
    // Only update when account or balance changes
  }, [
    account?.address,
    balance,
    fetchCurrentPositions,
    portfolioValue,
    setPortfolioValue,
  ]);

  // Force portfolio value refresh when balance changes from 0 to positive (e.g., after auto-deposit)
  const prevBalanceRef = useRef<number>(0);
  useEffect(() => {
    const currentBalance = balance ? Number(balance) / 1e18 : 0;
    if (prevBalanceRef.current === 0 && currentBalance > 0) {
      // Portfolio value needs to be recalculated
      // Do not set setPortfolioValue('--') here; just let the main effect run and update if needed
    }
    prevBalanceRef.current = currentBalance;
  }, [balance]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => router.push("/")}
                className="text-xl font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                The Citizen
              </button>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                className={getButtonStyling("/markets")}
                onClick={() => router.push("/markets")}
              >
                Markets
              </button>
              <button
                className={getButtonStyling("/market-ideas")}
                onClick={() => router.push("/market-ideas")}
              >
                New
              </button>
              <button
                className={getButtonStyling("/portfolio")}
                onClick={() => router.push("/portfolio")}
              >
                Portfolio
              </button>
              <button
                className={getButtonStyling("/deposit")}
                onClick={() => router.push("/deposit")}
              >
                Deposit
              </button>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Portfolio Value Display */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <span className="text-gray-900 font-medium text-sm">
                  Portfolio
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  {portfolioLoading || portfolioValue === "--" ? (
                    <>
                      <DenariusSymbol size={10} />
                      --
                    </>
                  ) : (
                    <>
                      <DenariusSymbol size={10} />
                      {Number(portfolioValue).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </>
                  )}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-900 font-medium text-sm">Cash</span>
                <span className="text-green-600 font-semibold text-sm">
                  {!account?.address || isPending ? (
                    <>
                      <DenariusSymbol size={10} />
                      --
                    </>
                  ) : (
                    <>
                      <DenariusSymbol size={10} />
                      {formatBalance(balance)}
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <ConnectButton
                client={client}
                wallets={wallets}
                connectButton={{
                  label: "Sign In",
                  className:
                    "px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50",
                }}
              />
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            <button
              onClick={() => handleMobileNavigation("/markets")}
              className={getMobileButtonStyling("/markets")}
            >
              Markets
            </button>
            <button
              onClick={() => handleMobileNavigation("/market-ideas")}
              className={getMobileButtonStyling("/market-ideas")}
            >
              New Ideas
            </button>
            <button
              onClick={() => handleMobileNavigation("/portfolio")}
              className={getMobileButtonStyling("/portfolio")}
            >
              Portfolio
            </button>
            <button
              onClick={() => handleMobileNavigation("/deposit")}
              className={getMobileButtonStyling("/deposit")}
            >
              Deposit
            </button>
          </div>

          {/* Mobile Portfolio Info */}
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="px-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium text-sm">
                  Portfolio
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  {portfolioLoading || portfolioValue === "--" ? (
                    <>
                      <DenariusSymbol size={10} />
                      --
                    </>
                  ) : (
                    <>
                      <DenariusSymbol size={10} />
                      {Number(portfolioValue).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium text-sm">Cash</span>
                <span className="text-green-600 font-semibold text-sm">
                  {!account?.address || isPending ? (
                    <>
                      <DenariusSymbol size={10} />
                      --
                    </>
                  ) : (
                    <>
                      <DenariusSymbol size={10} />
                      {formatBalance(balance)}
                    </>
                  )}
                </span>
              </div>
              <div className="pt-2">
                <ConnectButton
                  client={client}
                  wallets={wallets}
                  connectButton={{
                    label: "Sign In",
                    className:
                      "w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
