import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tra-bell - ホテル価格を自動監視",
  description:
    "楽天・じゃらんの予約が安くなったら自動で再予約。Tra-bellがあなたの代わりにホテル価格を監視し、キャンセル料発生前に節約します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-RTWEDVKT9Y" />
    </html>
  );
}
