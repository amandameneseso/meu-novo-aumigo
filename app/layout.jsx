import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ConvexClientProvider } from "@/providers/convexclientprovider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Focinhos Carentes - Give a Life a Second Chance",
  description: "Every animal deserves a loving home. Join our community of compassionate hearts and find your perfect companion today.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background-50 text-neutral-900`}
        >
          <ConvexClientProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
          </ConvexClientProvider>
        </body>
      </html>

      <Toaster richColors />
    </ClerkProvider>
  );
}
