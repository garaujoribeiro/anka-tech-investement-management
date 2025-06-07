import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/providers/client-providers";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme.provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anka Tech Investment Management",
  description:
    "Anka Tech Investment Management is a platform for managing and tracking investments in technology companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="pt-BR">
      <body className={cn("antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
