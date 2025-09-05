import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "KelSun Ventures Portal",
  description: "Business management portal for KelSun Ventures - Track investments, inventory, M-Pesa transactions, and profit-sharing calculations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
