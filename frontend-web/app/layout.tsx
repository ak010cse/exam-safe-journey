import "./globals.css"

export const metadata = {
  title: "Exam Safe Journey",
  description: "Student safety-first exam support platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F4F8FF]">
        <div className="min-h-screen">
          <div className="w-full max-w-screen-2xl mx-auto px-4">{children}</div>
        </div>
      </body>
    </html>
  )
}
