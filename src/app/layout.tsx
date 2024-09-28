import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff',
  variable: '--font-pretendard',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '위드',
  description: '위드',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  )
}
