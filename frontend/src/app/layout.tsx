import type { Metadata } from "next";
import "./globals.css";
import { Navbar, PageContainer } from "@/components/common";

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
      <body className="min-h-screen bg-gray-50">
        <Navbar />
        <PageContainer>{children}</PageContainer>
      </body>
    </html>
  );
}
