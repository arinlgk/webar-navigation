import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://aframe.io/releases/1.2.0/aframe.min.js" strategy="beforeInteractive" />
        <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>)
  }
}

