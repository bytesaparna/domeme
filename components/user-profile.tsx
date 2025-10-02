"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

type UserProfileProps = {
  name: string
  handle: string
  credits: number
}

export function UserProfile({ name, handle, credits }: UserProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="w-full border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:border-cyan-500/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/crypto-user-avatar.png" alt={`${name} avatar`} />
              <AvatarFallback aria-hidden>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base leading-none text-pretty">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{"@" + handle}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" aria-label="Add credits">
            Add credits
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Credits</p>
            <p className="text-lg font-semibold">{credits}</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Member</p>
            <p className="text-lg font-semibold">Pro</p>
          </div>
        </CardContent>
        <div className="px-6 pb-4">
          <Link
            href="/profile"
            className="inline-flex items-center text-xs font-medium text-cyan-400 hover:text-cyan-300"
            aria-label="View detailed profile"
          >
            View profile →
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
