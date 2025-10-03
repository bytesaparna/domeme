'use client'
import { useState } from "react"
import { Button } from "./ui/button"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"

const TWEETS = [
    "moon.cat 🚀 Just got listed!",
    "doge.com is trending again! 🐕",
    "pepe.io vibes are high today 😎",
    "shib.in spikes in visibility 🔥",
    "mog.xyz is gaining attention 🌟",
    "bonk.sol breaking records! 💥",
    "floki.wow is buzzing! 🐶",
    "wojak.fun memes are unstoppable 😂",
]

export const TweetSection = () => {
    const [tweet, setTweet] = useState("")
    const [tweetsList, setTweetsList] = useState<string[]>(TWEETS)

    const handleAddTweet = () => {
        if (!tweet.trim()) return
        setTweetsList((prev) => [tweet, ...prev])
        setTweet("")
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#a78bfa", "#ffffff", "#8b5cf6"],
        })
    }


    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <div className="w-80 flex flex-col flex-shrink-0">
                <div
                    className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg"

                >
                    <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            U
                        </div>

                        {/* Input area */}
                        <div className="flex-1">
                            <textarea
                                id="trend-input"
                                value={tweet}
                                onChange={(e) => setTweet(e.target.value)}
                                placeholder="What’s happening in domains? (e.g. moon.cat 🚀)"
                                rows={3}
                                className={cn(
                                    "w-full resize-none rounded-md bg-transparent px-2 py-2 text-sm outline-none",
                                    "placeholder:text-muted-foreground"
                                )}
                            />
                        </div>
                    </div>
                    {/* Bottom actions */}
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground">
                            Submissions and boosts increase visibility.
                        </p>
                        <Button
                            type="submit"
                            className="rounded-full px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                            onClick={handleAddTweet}
                        >
                            Tweet
                        </Button>
                    </div>
                </div>
            </div>
            <div className="space-y-2 border border-purple-400/30 rounded-lg p-4">
                <h3 className="font-semibold">Recent Tweets</h3>
                <div className="flex flex-col gap-4 h-[350px] overflow-auto">
                    {tweetsList.map((tweet, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10 py-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                T
                            </div>
                            <p className="text-sm text-white">{tweet}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}