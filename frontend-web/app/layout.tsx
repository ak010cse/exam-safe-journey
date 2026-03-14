import "./globals.css"
import Header from "./components/Header"
import { Providers } from './providers'

export const metadata = {
  title: "Examtur",
  description: "Student safety-first exam support platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F4F8FF]" suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen">
            <div className="w-full max-w-screen-2xl mx-auto px-0 md:px-4">
              <header className="w-full">
                {/* Header is a client component; it handles responsive navigation */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* Using dynamic import to avoid server-side rendering issues */}
                <Header />
              </header>
              <main className="px-4 md:px-12 pt-4 md:pt-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
