import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Medivue — Every Signal Survives the Handoff",
  description:
    "Connected rapid emergency assessment that keeps one continuous patient record moving from authorized responder to ambulance to hospital.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakarta.variable} antialiased`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
