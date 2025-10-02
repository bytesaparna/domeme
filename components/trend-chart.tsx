"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts"
import { motion } from "framer-motion"

type Point = { label: string; value: number }
type TrendChartProps = {
  data: Point[]
  label?: string
  colorVar?: string // e.g., var(--chart-1)
  height?: number
  kind?: "area" | "bar"
}

export function TrendChart({
  data,
  label = "Trend",
  colorVar = "var(--chart-1)",
  height = 160,
  kind = "area",
}: TrendChartProps) {
  const stroke = colorVar
  return (
    <motion.div
      style={{ height }}
      className="w-full"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {kind === "area" ? (
          <AreaChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke as string} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke as string} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={label}
              stroke={stroke as string}
              strokeWidth={2}
              fill="url(#trendFill)"
              dot={false}
              activeDot={false}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 12, right: 16, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            />
            {/* No Legend to reduce clutter */}
            <Bar dataKey="value" name={label} fill={stroke as string} radius={[8, 8, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
