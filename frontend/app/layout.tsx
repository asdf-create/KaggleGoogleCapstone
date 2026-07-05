import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudyMate AI - Autonomous AI Learning Companion',
  description: 'AI Multi-Agent Learning Companion built for Kaggle Capstone Project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
