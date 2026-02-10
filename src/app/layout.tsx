import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    default: "LogoHustle - Create Custom Logos in Seconds",
    template: "%s | LogoHustle",
  },
  description: 'Design and customize your perfect logo with an intuitive and powerful editor. Create a professional brand identity with ease.',
  keywords: ["logo maker", "logo creator", "logo design", "custom logo", "brand identity", "graphic design tool"],
  authors: [{ name: "LogoHustle" }],
  openGraph: {
    title: "LogoHustle - Create Custom Logos in Seconds",
    description: "Design and customize your perfect logo with an intuitive and powerful editor.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LogoHustle - Create Custom Logos in Seconds",
    description: "Design and customize your perfect logo with an intuitive and powerful editor.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
