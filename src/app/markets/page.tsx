"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MarketCard from "../../../components/MarketCard";
import Navbar from "../../../components/Navbar";
import { getAllMarkets, Market } from "../../../src/data/markets";

const MarketsContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || "all";

  // Get all markets
  const allMarkets = getAllMarkets();

  // Filter markets based on category
  const getFilteredMarkets = () => {
    const historyMarkets = ["jfk", "moon-landing", "alien"];
    const scienceMarkets = ["vaccine", "string-theory", "covid-vaccine"];

    switch (category) {
      case "history":
        return allMarkets.filter((market) =>
          historyMarkets.includes(market.id)
        );
      case "science":
        return allMarkets.filter((market) =>
          scienceMarkets.includes(market.id)
        );
      default:
        return allMarkets;
    }
  };

  const filteredMarkets = getFilteredMarkets();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center w-full pt-8">
      {/* Title for each category */}
      <div className="w-full max-w-5xl mx-auto px-5">
        {category === "history" && (
          <>
            <h1 className="text-[24px] font-bold text-[#171A22] mb-1">
              History Markets
            </h1>
          </>
        )}
        {category === "science" && (
          <>
            <h1 className="text-[24px] font-bold text-[#171A22] mb-1">
              Science Markets
            </h1>
          </>
        )}
      </div>
      {/* Active Markets Section */}
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col gap-6 w-full max-w-5xl">
          {/* Display markets in rows of 2 */}
          {filteredMarkets.length > 0 ? (
            filteredMarkets
              .reduce((rows: Market[][], market: Market, index: number) => {
                if (index % 2 === 0) {
                  rows.push([market]);
                } else {
                  rows[rows.length - 1].push(market);
                }
                return rows;
              }, [])
              .map((row: Market[], rowIndex: number) => (
                <div
                  key={rowIndex}
                  className="flex flex-col sm:flex-row gap-6 w-full"
                >
                  {row.map((market: Market) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 text-lg">
              No markets found for this category.
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-8 bg-[#f8f9fa]"></div>
    </div>
  );
};

const MarketsPage = () => {
  return (
    <div>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
            Loading markets...
          </div>
        }
      >
        <MarketsContent />
      </Suspense>
    </div>
  );
};

export default MarketsPage;
