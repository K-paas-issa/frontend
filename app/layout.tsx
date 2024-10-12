import type { Metadata } from "next";
import "./globals.css";
import { DialogProvider, QueryClientProvider } from "@/lib";

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
      <body>
        <QueryClientProvider>
          <DialogProvider>
            <div className="w-screen">{children}</div>
          </DialogProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
