import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "CC GIF Generator",
  description: "Interactive thinking animation with GIF export functionality",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style>{`
          :root {
            --font-geist-sans: ${GeistSans.style.fontFamily};
            --font-geist-mono: ${GeistMono.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="font-mono">{children}</body>
    </html>
  )
}
