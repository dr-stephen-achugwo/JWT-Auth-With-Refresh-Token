import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../../context/authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MERN JWT",
  description: "MERN JWT",
};

import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NextTopLoader color="#000000" showSpinner={false} />
          <Toaster />
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
