import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "VBRO Cup 2026",
  description: "World Cup prediction ranking for the VBRO Cup 2026.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}