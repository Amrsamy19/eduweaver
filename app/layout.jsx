import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "EduWEAVER - The School at Home",
  description: "Experience premium home schooling with EduWEAVER. Modern, interactive, and effective online education.",
};

import Sidebar from "@/components/Sidebar/Sidebar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ height: '100vh', overflow: 'hidden' }}>
        <SessionProvider session={session}>
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, height: '100vh', overflowY: 'auto', position: 'relative' }}>
              {children}
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
