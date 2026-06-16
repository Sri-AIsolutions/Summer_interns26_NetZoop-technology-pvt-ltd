import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curriculum Chatbot",
  description:
    "AI-powered curriculum information system for Amrita Vishwa Vidyapeetham",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
