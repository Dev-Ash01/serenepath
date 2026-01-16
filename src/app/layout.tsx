// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SerenePath - AI Mental Wellness Companion',
  description: 'A compassionate AI companion for emotional support and mental wellness',
  icons: {
    icon: '🧠',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#0d9488' />
      </head>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
