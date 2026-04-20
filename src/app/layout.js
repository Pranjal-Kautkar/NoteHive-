import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NoteHive | Student Note Portal",
  description: "A beautifully designed platform to share and download student class notes across subjects.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="w-full py-6 mt-auto text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <p>© 2026 NoteHive. All rights reserved.</p>
          <p className="mt-1">Developed by Pranjal Kautkar</p>
        </footer>
      </body>
    </html>
  );
}
