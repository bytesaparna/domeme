"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ALL_COINS, getCategory, Memecoin, MemecoinCard } from "./memecoin-card";
import { Badge } from "./ui/badge";

export default function ExpandableMemecoinDemo({ coin }: { coin: Memecoin }) {
  const [active, setActive] = useState<Memecoin | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const category = getCategory(coin.trendScore)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Background Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.symbol}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col overflow-hidden"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 rounded-full p-2"
                onClick={() => setActive(null)}
              >
                ✕
              </button>

              {/* Expanded Content – use MemecoinCard */}
              <div className="bg-neutral-900 p-2 rounded-xl">
                <MemecoinCard coin={active} />
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* List of Coins */}
      <ul className="w-full flex flex-col gap-4 mt-8">
        <motion.li
          layoutId={`card-${coin.symbol}-${id}`}
          key={coin.symbol}
          onClick={() => setActive(coin)}
          className="z-50 w-full p-4 flex items-center justify-between cursor-pointer border border-purple-400/30 rounded-2xl bg-black"
        >
          {/* Left: Coin Info */}
          <div className="flex items-center justify-between gap-4">
            <img
              src={coin.imageUrl}
              alt={coin.name}
              className="h-16 w-16 rounded-lg object-cover border border-white/20"
            />
            <div className="flex flex-col">
              <div className="flex gap-2 mb-1">
                <h3 className="text-white font-semibold">{coin.name}</h3>
                <Badge
                  variant="outline"
                  className={
                    category === "Premium"
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : category === "Not-So-Premium"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                  }
                >
                  {category}
                </Badge>
              </div>
              <p className="text-sm text-slate-400">Symbol: {coin.symbol}</p>
              <p className="text-sm text-slate-400">Score: {coin.trendScore}/100</p>

            </div>
          </div>

          {/* Right: View Details Button */}
          <button
            onClick={() => setActive(coin)}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-purple-400 text-black hover:bg-slate-100 transition"
          >
            View Domains
          </button>
        </motion.li>
      </ul>
    </>
  );
}
