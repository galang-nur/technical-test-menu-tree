import type { Metadata } from 'next'

import "./globals.css"
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Menu Tree System',
  description: 'Hierarchical menu management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}