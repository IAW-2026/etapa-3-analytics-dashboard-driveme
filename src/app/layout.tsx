import type { Metadata } from 'next'
import { Inter, Michroma } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const michroma = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'DriveMe Analytics',
  description: 'Analytics Dashboard — DriveMe Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${michroma.variable}`}>
      <body className="antialiased">
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            className="p-4 md:py-6 md:pr-6 md:pl-[264px]"
            style={{
              flex: 1,
              minHeight: '100vh',
              overflowY: 'auto',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
