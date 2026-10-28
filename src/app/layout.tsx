import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "MyTeach — Müəllim və Şagird Platforması",
  description:
    "Şagirdlər fənn, sektor, məqsəd və şəhər üzrə təsdiqlənmiş müəllimləri asanlıqla tapır. Müəllimlər profillərini yaradaraq xidmətlərini təqdim edir. Tam pulsuz platforma.",
  keywords: [
    "MyTeach",
    "müəllim",
    "şagird",
    "dərs",
    "muəllim tap",
    "tutor",
    "teacher",
    "репетитор",
  ],
  authors: [{ name: "MyTeach" }],
  openGraph: {
    title: "MyTeach — Müəllim və Şagird Platforması",
    description:
      "Doğru müəllimi bir neçə saniyəyə tap. Tam pulsuz platforma.",
    siteName: "MyTeach",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
