"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  User,
  Bell,
  Settings,
  TrendingUp,
  Heart,
  ShoppingCart,
  Award,
  Calendar,
  DollarSign,
  Activity,
  ArrowLeft,
} from "lucide-react"
import { TrendChart } from "@/components/trend-chart"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const purchaseHistory = [
    { domain: "dogecoin.com", date: "2025-01-15", price: "₹49,999", status: "Active" },
    { domain: "getshib.io", date: "2025-01-10", price: "₹29,999", status: "Active" },
    { domain: "pepehq.ai", date: "2024-12-28", price: "₹39,999", status: "Active" },
    { domain: "bonkdomains.xyz", date: "2024-12-15", price: "₹15,999", status: "Pending Transfer" },
  ]

  const portfolioValue = [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 48 },
    { label: "Apr", value: 61 },
    { label: "May", value: 55 },
    { label: "Jun", value: 67 },
    { label: "Jul", value: 73 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-slate-100">
      {/* Navigation header */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
                MemeDomains
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-sm text-slate-400 transition hover:text-slate-300">
                Marketplace
              </Link>
              <Link href="/portfolio" className="text-sm text-slate-400 transition hover:text-slate-300">
                Portfolio
              </Link>
              <Link href="/watchlist" className="text-sm text-slate-400 transition hover:text-slate-300">
                Watchlist
              </Link>
              <Link href="/profile" className="text-sm text-cyan-400 transition hover:text-cyan-300">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-cyan-500"></span>
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-slate-400 hover:text-slate-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-4 border-cyan-500/20">
                    <AvatarImage src="/crypto-user-avatar.png" alt="Alex Chen" />
                    <AvatarFallback className="bg-slate-700 text-2xl text-cyan-500">AC</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold text-slate-100">Alex Chen</h2>
                  <p className="text-sm text-slate-400">@alexcrypto</p>
                  <Badge className="mt-2 border-purple-500/30 bg-purple-500/10 text-purple-400">Pro Member</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
                      <ShoppingCart className="mx-auto mb-1 h-5 w-5 text-cyan-400" />
                      <p className="text-sm text-slate-400">Domains</p>
                      <p className="text-2xl font-bold text-cyan-400">12</p>
                    </div>
                    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
                      <Heart className="mx-auto mb-1 h-5 w-5 text-pink-400" />
                      <p className="text-sm text-slate-400">Watchlist</p>
                      <p className="text-2xl font-bold text-pink-400">8</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-slate-400">Credits</p>
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">₹2,45,000</p>
                    <Button size="sm" className="mt-3 w-full bg-gradient-to-r from-green-600 to-emerald-600">
                      Add Credits
                    </Button>
                  </div>

                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-300">Profile Completion</p>
                      <p className="text-sm text-cyan-400">85%</p>
                    </div>
                    <Progress value={85} className="h-2 bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: "85%" }}
                      />
                    </Progress>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-700 bg-slate-800/50 text-slate-300"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-slate-700 bg-slate-800/50 text-slate-300"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements card */}
            <Card className="mt-6 border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
                    <div className="text-2xl">🏆</div>
                    <p className="mt-1 text-xs text-slate-400">First Buy</p>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
                    <div className="text-2xl">💎</div>
                    <p className="mt-1 text-xs text-slate-400">Diamond Hands</p>
                  </div>
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 text-center">
                    <div className="text-2xl">🚀</div>
                    <p className="mt-1 text-xs text-slate-400">Early Adopter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 w-full bg-slate-800/50 p-1">
                <TabsTrigger
                  value="overview"
                  className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="domains"
                  className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600"
                >
                  My Domains
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Portfolio value chart */}
                <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-100">
                      <TrendingUp className="h-5 w-5 text-cyan-400" />
                      Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold text-slate-100">₹4,85,997</p>
                        <p className="text-sm text-green-400">+24.5% this month</p>
                      </div>
                      <Badge className="border-green-500/30 bg-green-500/10 text-green-400">All-time high</Badge>
                    </div>
                    <TrendChart
                      data={portfolioValue}
                      label="Value (₹K)"
                      colorVar="hsl(var(--chart-1))"
                      height={200}
                      kind="area"
                    />
                  </CardContent>
                </Card>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Total Spent</p>
                          <p className="text-2xl font-bold text-slate-100">₹3,42,996</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-cyan-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Avg. Domain Value</p>
                          <p className="text-2xl font-bold text-slate-100">₹40,500</p>
                        </div>
                        <Activity className="h-8 w-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Member Since</p>
                          <p className="text-2xl font-bold text-slate-100">Dec 2024</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="domains" className="space-y-4">
                <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Owned Domains</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {purchaseHistory.map((purchase, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/50 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                              <span className="text-lg font-bold text-white">
                                {purchase.domain.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-100">{purchase.domain}</p>
                              <p className="text-xs text-slate-400">Purchased {purchase.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-cyan-400">{purchase.price}</p>
                            <Badge
                              variant="outline"
                              className={
                                purchase.status === "Active"
                                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              }
                            >
                              {purchase.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "Purchased",
                          domain: "dogecoin.com",
                          time: "2 days ago",
                          icon: ShoppingCart,
                          color: "text-green-400",
                        },
                        {
                          action: "Added to watchlist",
                          domain: "mokacoin.io",
                          time: "5 days ago",
                          icon: Heart,
                          color: "text-pink-400",
                        },
                        {
                          action: "Price alert set",
                          domain: "pepehq.ai",
                          time: "1 week ago",
                          icon: Bell,
                          color: "text-cyan-400",
                        },
                        {
                          action: "Purchased",
                          domain: "getshib.io",
                          time: "2 weeks ago",
                          icon: ShoppingCart,
                          color: "text-green-400",
                        },
                      ].map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 border-b border-slate-700/30 pb-4 last:border-0"
                        >
                          <div className={`rounded-full bg-slate-800/50 p-2 ${activity.color}`}>
                            <activity.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-100">
                              {activity.action} <span className="text-cyan-400">{activity.domain}</span>
                            </p>
                            <p className="text-xs text-slate-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
