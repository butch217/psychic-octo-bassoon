import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sentinel Gaming | Gamers World",
  description: "Gaming guides, community updates, and selected gaming offers for the Sentinel community.",
  applicationName: "Sentinel Gaming",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}