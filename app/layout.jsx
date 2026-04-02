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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flexGrow: 1, minHeight: '100vh', position: 'relative' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
