import { GlobalNav } from "@/components/shell/GlobalNav";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LA Mobility Atlas — Explore the geography of movement",
  description:
    "An interactive scientific exploration platform for investigating synthetic vehicle mobility patterns across metropolitan Los Angeles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080d14] text-[#e6edf3] h-screen w-screen overflow-hidden flex flex-col font-sans">
        <Providers>
          <GlobalNav />
          <main className="flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
