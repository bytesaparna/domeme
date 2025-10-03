"use client";
import React, { useMemo } from "react";
import { TrendChart } from "./trend-chart";
import { ALL_COINS, getCategory } from "./memecoin-card";
import { FocusCards, Card as FocusCardType } from "./ui/focus-cards";

export const InfoCards = () => {
  const categorySummary = useMemo(() => {
    const counts = { Premium: 0, "Not-So-Premium": 0, Budding: 0 };
    ALL_COINS.forEach((c) => {
      const cat = getCategory(c.trendScore);
      counts[cat] += 1;
    });
    return [
      { label: "Premium", value: counts["Premium"] },
      { label: "Not-So-Premium", value: counts["Not-So-Premium"] },
      { label: "Budding", value: counts["Budding"] },
    ];
  }, []);

  const cards: FocusCardType[] = [
    {
      title: "Category Distribution",
      src: "/placeholder-bg.jpg",
      children: (
        <TrendChart
          data={categorySummary}
          label="Listings"
          colorVar="hsl(var(--chart-1))"
          height={200}
          kind="bar"
        />
      ),
    },
    {
      title: "Market Activity",
      src: "/placeholder-bg.jpg",
      children: (
        <TrendChart
          data={Array.from({ length: 7 }, (_, i) => {
            const sum = ALL_COINS.reduce((acc, c) => acc + c.sparkline[i], 0);
            return { label: `D${i + 1}`, value: Math.round(sum / ALL_COINS.length) };
          })}
          label="Buzz"
          colorVar="hsl(var(--chart-2))"
          height={200}
          kind="area"
        />
      ),
    },
    {
      title: "Top Gainers (24h)",
      src: "/placeholder-bg.jpg",
      children: (
        <div className="space-y-3">
          {ALL_COINS.slice(0, 3).map((coin, idx) => (
            <div key={coin.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">#{idx + 1}</span>
                <img
                  src={coin.imageUrl || "/placeholder.svg"}
                  alt={coin.name}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-sm font-medium text-slate-300">{coin.name}</span>
              </div>
              <span className="border-green-500/30 bg-green-500/10 text-green-400 px-2 py-1 rounded">
                +{Math.floor(Math.random() * 20 + 5)}%
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return <FocusCards cards={cards} />;
};
