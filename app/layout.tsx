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
  title: {
    default: "Tra-bell - 予約後のホテル価格を自動監視",
    template: "%s | Tra-bell",
  },
  description:
    "そのホテル予約、もっと安くなるかも？Tra-bellは楽天・じゃらんの価格を自動監視。値下がりしたら通知でお知らせし、あなたの代わりに旅費を賢く節約します。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://tra-bell.com"
  ),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "Tra-bell - ホテル価格を自動監視",
    description:
      "そのホテル予約、もっと安くなるかも？Tra-bellは楽天・じゃらんの価格を自動監視。値下がりしたら通知でお知らせし、あなたの代わりに旅費を賢く節約します。",
    siteName: "Tra-bell",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tra-bell - ホテル価格を自動監視",
    description:
      "そのホテル予約、もっと安くなるかも？Tra-bellは楽天・じゃらんの価格を自動監視。値下がりしたら通知でお知らせし、あなたの代わりに旅費を賢く節約します。",
  },
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
