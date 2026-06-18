import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'DriveMe Analytics',
  description: 'Analytics Dashboard — DriveMe Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              minHeight: '100vh',
              overflowY: 'auto',
              padding: '0',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
