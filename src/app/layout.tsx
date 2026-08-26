import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mbalimapholiinc.co.za";
const SITE_NAME = "Urban Dinners";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Urban Dinners | 36 SA Dinner Recipes by Registered Dietitian Mbali Mapholi",
    template: "%s | Urban Dinners",
  },
  description:
    "36 dietitian-approved South African dinner recipes with kilojoule info, meal planning, grocery lists & dietary filters. By Registered Dietitian Mbali Mapholi. Winter 2026 Collection.",
  keywords: [
    "Urban Dinners",
    "South African dinner recipes",
    "SA meal planning",
    "dietitian recipes South Africa",
    "family meals",
    "healthy eating South Africa",
    "Mbali Mapholi",
    "registered dietitian",
    "winter dinner recipes",
    "meal plan South Africa",
    "budget meals South Africa",
    "kj nutrition info",
    "pap recipes",
    "samp and beans",
    "South African stew recipes",
    "quick weeknight dinners SA",
  ],
  authors: [{ name: "Mbali Mapholi, Registered Dietitian (SA)", url: "https://mbalimapholiinc.co.za" }],
  creator: "Mbali Mapholi",
  publisher: "Urban Dinners",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Urban Dinners | 36 SA Dinner Recipes by Registered Dietitian Mbali Mapholi",
    description:
      "36 dietitian-approved South African dinner recipes with kilojoule info, meal planning, grocery lists & dietary filters. Winter 2026 Collection.",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "Urban Dinners — 36 South African dinner recipes by Registered Dietitian Mbali Mapholi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Dinners | 36 SA Dinner Recipes by RD Mbali Mapholi",
    description:
      "36 dietitian-approved South African dinner recipes with kilojoule info, meal planning & grocery lists. Winter 2026 Collection.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
  },
  category: "food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data: Brand + Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "WebSite"],
              name: "Urban Dinners",
              alternateName: "Urban Dinners by Mbali Mapholi",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.svg`,
              description:
                "36 dietitian-approved South African dinner recipes with kilojoule info, meal planning, grocery lists & dietary filters. By Registered Dietitian Mbali Mapholi.",
              founder: {
                "@type": "Person",
                name: "Mbali Mapholi",
                jobTitle: "Registered Dietitian",
                honorificPrefix: "RD",
                knowsAbout: ["Nutrition", "Dietetics", "South African cuisine", "Family meal planning"],
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Preconnect to Paystack for faster checkout */}
        <link rel="preconnect" href="https://paystack.shop" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}