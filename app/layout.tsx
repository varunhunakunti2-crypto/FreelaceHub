import "./globals.css";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import ClickRipple from "@/components/ui/ClickRipple";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Agency Management",
  description: "The all-in-one platform for freelancers and clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-primary/10 selection:text-primary min-h-screen bg-transparent">
        <AnimatedBackground />
        <ClickRipple />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
