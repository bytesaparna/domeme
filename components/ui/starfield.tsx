'use client'
import { useMemo } from "react";

export const StarField = ({ count = 40 }: { count?: number }) => {
    const stars = useMemo(() => {
        return Array.from({ length: count }, () => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 4 + 2, // star size 2–6px
            delay: `${Math.random() * 5}s`,
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 z-[1] pointer-events-none">
            {stars.map((star, idx) => (
                <div
                    key={idx}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        animationDelay: star.delay,
                    }}
                />
            ))}
        </div>
    );
};