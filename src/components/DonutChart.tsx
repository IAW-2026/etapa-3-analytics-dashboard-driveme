'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface DonutChartProps {
  data: { name: string; value: number; color: string }[]
  height?: number
}

export default function DonutChart({ data, height = 180 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
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
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          className="font-mono"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: 1,
            textShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
          }}
        >
          {total}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '10px', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>total</div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginTop: '12px',
        }}
      >
        {data.map((entry) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '0px',
                backgroundColor: entry.color,
                boxShadow: `0 0 8px ${entry.color}`,
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '11px', letterSpacing: '0.02em' }}>
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
