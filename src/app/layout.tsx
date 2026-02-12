import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL("https://logohustle.vercel.app"),

  title: {
    default: "Free Online Logo Maker – Create Custom Logos Instantly | LogoHustle",
    template: "%s | LogoHustle",
  },

  description:
    "Create professional logos online in seconds. Use icons, custom text, fonts, and colors to design your brand identity. Export as PNG, SVG, or favicon. Free and no signup required.",

  keywords: [
    "free logo maker",
    "online logo maker",
    "custom logo creator",
    "create logo online",
    "favicon generator",
    "PNG logo download",
    "SVG logo export",
    "brand logo designer",
    "startup logo maker",
    "app logo maker",
    "modern logo design tool"
  ],

  authors: [{ name: "LogoHustle" }],
  creator: "LogoHustle",
  publisher: "LogoHustle",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://logohustle.vercel.app",
  },

  openGraph: {
    type: "website",
    url: "https://logohustle.vercel.app",
    siteName: "LogoHustle",
    title: "Free Online Logo Maker – Design & Export PNG, SVG, Favicon",
    description:
      "Design professional logos using icons, custom text, fonts, and custom colors. Instantly export your logo as PNG, SVG, or favicon. Fast, free, and no signup required.",
    locale: "en_US",
    images: [
      {
        url: "https://logohustle.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "LogoHustle – Free Online Logo Maker and Logo Export Tool",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Online Logo Maker – Create & Export Logos Instantly",
    description:
      "Design logos with icons, custom text, and colors. Export as PNG, SVG, or favicon. Free and easy to use.",
    creator: "@svddiin",
    images: ["https://logohustle.vercel.app/x-og.png"],
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Inter:wght@400;500;600;700&family=Lobster&family=Oswald&family=Pacifico&family=Playfair+Display&family=Roboto+Slab&family=Shadows+Into+Light&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
