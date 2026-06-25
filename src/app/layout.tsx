import type { Metadata } from 'next'
import { Inter, Michroma } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const michroma = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-michroma' })

export const metadata: Metadata = {
  title: 'DriveMe Analytics',
  description: 'Analytics Dashboard — DriveMe Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${inter.variable} ${michroma.variable}`}>
        <head>
          <link rel="preconnect" href="https://scdn.clerk.com" />
          <link rel="preconnect" href="https://segapi.clerk.com" />
        </head>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
