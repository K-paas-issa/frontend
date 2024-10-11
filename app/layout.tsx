import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/molecule";
import { DialogProvider } from "@/lib";

export const metadata: Metadata = {
  title: "오물풍선 알리미",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head></head>
      <body>
        <DialogProvider>
          {children}
          <Toaster />
        </DialogProvider>
      </body>
    </html>
  );
}
