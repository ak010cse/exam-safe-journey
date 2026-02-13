export const metadata = {
  title: "Exam Safe Journey",
  description: "Student safety-first exam travel support platform"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F4F8FF] text-gray-800">
        {children}
      </body>
    </html>
  )
}
