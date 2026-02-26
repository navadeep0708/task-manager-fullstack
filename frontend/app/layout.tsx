import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "Task Manager",
  description: "JWT Task Management App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}