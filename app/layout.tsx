import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LiveChat from "@/components/LiveChat";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Black Pyramids Tours | Luxury Egypt Travel Agency & Planning",
    template: "%s | Black Pyramids Tours",
  },
  description:
    "Luxury travel agency in Egypt · Est. 2005. Handpicked 5-star hotel reservations, private guided tours, and premium transportation across Cairo, Luxor, Aswan, and Hurghada. Fluent English-speaking team.",
  keywords:
    "Egypt travel agency, luxury Egypt tours, hotel booking Egypt, private transportation Cairo, Nile cruise booking, luxury Egypt itinerary planner, Black Pyramids Tours",
  authors: [{ name: "Black Pyramids Tours" }],
  creator: "Black Pyramids Tours",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Black Pyramids Tours",
    title: "Black Pyramids Tours | Luxury Egypt Travel Agency & Planning",
    description:
      "Exclusive 5-star hotels, custom private tours, and luxury transportation across Giza, Cairo, Luxor, Aswan, and Alexandria. Est. 2005.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Giza Pyramids — Black Pyramids Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Pyramids Tours | Luxury Egypt Travel Agency",
    description:
      "Your trusted Egypt travel partner since 2005. Handpicked hotels, private daily tours, and luxury transport with a fluent English-speaking team.",
    images: [
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop",
    ],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Black Pyramids Tours",
  description:
    "Luxury Egypt travel agency since 2005. Custom private tours, 5-star hotel reservations, and professional transport with a fluent English team.",
  telephone: "+201211385550",
  email: "info@blackpyramidsgateway.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nazlet El Batran, Pyramids Area",
    addressLocality: "Giza",
    addressCountry: "EG",
  },
  geo: { "@type": "GeoCoordinates", latitude: 29.9773, longitude: 31.1325 },
  priceRange: "$$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1534",
  },
  openingHours: "Mo-Su 00:00-24:00",
  image:
    "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <LiveChat />
      </body>
    </html>
  );
}
