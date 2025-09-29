"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getAllMarkets } from "../src/data/markets";
import MarketCard from "./MarketCard";

const Homepage = () => {
  // Get all markets
  const markets = getAllMarkets();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col w-full">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to The Citizen!</span>
              <span className="block text-blue-500">
                Bet on What You Believe
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A home for honest debate about anything. Bet on what you believe,
              challenge convention, and earn for being right.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                  onClick={() => router.push("/markets")}
                >
                  Get Started
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <button
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  onClick={() => router.push("/market-ideas")}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Markets Section */}
      <div className="w-full flex flex-col items-center pt-5 md:pt-10">
        <div className="flex flex-col gap-6 w-full max-w-5xl">
          {/* First row - JFK and Moon Landing */}
          <div className="flex flex-col sm:flex-row gap-6 w-full">
            {markets.slice(0, 2).map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
          {/* Second row - Alien and Vaccine markets */}
          {markets.length > 2 && (
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {markets.slice(2, 4).map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
          {/* Third row - String Theory and COVID Vaccine markets */}
          {markets.length > 4 && (
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {markets.slice(4, 6).map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
          {/* Fourth row - Jesus market */}
          {markets.length > 6 && (
            <div className="flex flex-col sm:flex-row gap-6 w-full">
              {markets.slice(6, 7).map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-8 bg-[#f8f9fa]"></div>
    </div>
  );
};

export default Homepage;
