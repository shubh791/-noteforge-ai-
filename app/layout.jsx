import './globals.css'

export const metadata = {
  title: 'NoteForge AI — Turn Any Text into Structured Study Notes',
  description: 'Paste raw lecture or exam text and get beautiful, structured study notes instantly. AI-powered by NVIDIA NIM with Llama 3.1.',
  keywords: ['study notes', 'AI notes', 'NVIDIA NIM', 'Llama', 'exam notes', 'lecture notes'],
  authors: [{ name: 'Shubham Panghal' }],
  creator: 'Shubham Panghal',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'NoteForge AI — Turn Any Text into Structured Study Notes',
    description: 'AI-powered study notes generator. Paste raw text, get beautiful visual notes instantly.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#7c3aed',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
