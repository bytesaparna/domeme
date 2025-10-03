"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export type Card = {
    title: string;
    src: string;
    children?: React.ReactNode
};


export const Card = React.memo(
    ({
        card,
        index,
        hovered,
        setHovered,
    }: {
        card: any;
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    }) => (
        <div
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}

            className={cn(
                "relative border border-purple-700/40 p-2 rounded-lg transition-all duration-300 hover:scale-105  bg-gradient-to-br from-purple-900/20 to-slate-600 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full ease-out flex flex-col items-center justify-center",
                hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
            )}
            style={{
                border: "2px solid rgba(107, 33, 168, 0.4)", 
                borderRadius: "10px",
                padding: "20px",
                transition: "box-shadow 0.3s, transform 0.3s",
                boxShadow: hovered !== null && hovered == index
                    ? "0 15px 35px rgba(107, 33, 168, 0.7)" 
                    : "0 10px 25px rgba(107, 33, 168, 0.4)", 
            }}
        >
            <div
                className={cn(
                    "absolute inset-0 bg-black/50 py-8 px-4 transition-opacity duration-300",)}>
                <div className="text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 font-semibold">
                    {card.title}
                </div>
                {card.children && <div className="mt-6 w-full">{card.children}</div>}
            </div>
        </div>
    )
);

Card.displayName = "Card";


export function FocusCards({ cards }: { cards: Card[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 max-w-5xl mx-auto md:px-8 w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.title}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}
