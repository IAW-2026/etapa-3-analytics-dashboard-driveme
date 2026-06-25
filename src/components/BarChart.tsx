'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
  height?: number
}

export default function BarChart({ data, color = 'var(--color-primary)', height = 220 }: BarChartProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(220, 38, 38, 0.1)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-inter, sans-serif)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontFamily: 'var(--font-inter, sans-serif)' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(10, 10, 10, 0.9)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: 'var(--radius-input)',
            color: 'var(--color-text-primary)',
            fontSize: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 15px rgba(220, 38, 38, 0.1)',
          }}
          cursor={{ fill: 'rgba(220, 38, 38, 0.05)' }}
        />
        <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
