"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "../src/client";
import { base } from "thirdweb/chains";
import { Market } from "../src/data/markets";

interface MarketCardProps {
  market: Market;
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const router = useRouter();

  // Create contract instance for this specific market
  const marketContractInstance = getContract({
    client,
    chain: base,
    address: market.contractAddress,
  });

  // Fetch current odds for Yes (0) and No (1) positions for this specific market
  const { data: oddsYes } = useReadContract({
    contract: marketContractInstance,
    method: "function odds(uint256 _outcome) view returns (int128)",
    params: [0n],
  });

  const { data: oddsNo } = useReadContract({
    contract: marketContractInstance,
    method: "function odds(uint256 _outcome) view returns (int128)",
    params: [1n],
  });

  // Convert odds to probabilities
  const yesProbability =
    oddsYes !== undefined ? Number(oddsYes) / Math.pow(2, 64) : 0;
  const noProbability =
    oddsNo !== undefined ? Number(oddsNo) / Math.pow(2, 64) : 0;

  return (
    <div className="market-card bg-white overflow-hidden shadow rounded-lg transition-all duration-200 w-full sm:w-1/2">
      <div className="mb-4">
        <Image
          src={market.image}
          alt={market.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover object-top"
        />
      </div>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">{market.title}</h3>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{market.outcomes[0]}</span>
            <span>{market.outcomes[1]}</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{
                width: `${
                  yesProbability > 0 ? Math.round(yesProbability * 100) : 0
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm font-medium">
            <span className="text-blue-500">
              {yesProbability > 0
                ? `${Math.round(yesProbability * 100)}%`
                : "0%"}
            </span>
            <span className="text-gray-500">
              {noProbability > 0 ? `${Math.round(noProbability * 100)}%` : "0%"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>Volume: $0</span>
          <span>Closes: Ongoing</span>
        </div>
        <div className="mt-5">
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
            onClick={() => router.push(`/markets/${market.id}`)}
          >
            Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;
