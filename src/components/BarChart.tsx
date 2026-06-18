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

export default function BarChart({ data, color = '#22d3ee', height = 220 }: BarChartProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(51, 65, 85, 0.3)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '6px',
            color: '#e2e8f0',
            fontSize: '12px',
          }}
          cursor={{ fill: 'rgba(51, 65, 85, 0.15)' }}
        />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
