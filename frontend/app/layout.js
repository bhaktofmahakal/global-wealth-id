import './globals.css'

export const metadata = {
  title: 'Global Wealth ID',
  description: 'Convert credit scores across countries',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}