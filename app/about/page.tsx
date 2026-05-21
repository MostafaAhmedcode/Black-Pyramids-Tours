import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import AboutUsPage from '@/components/AboutUsPage';

export const metadata: Metadata = {
  title: 'About Black Pyramids Tours | Egypt Travel Agency Since 2005',
  description: 'Learn about Black Pyramids Tours - your trusted Egypt travel partner for 19+ years. Expert guides, luxury hotels, custom itineraries, and 24/7 support.',
  keywords: 'about Black Pyramids Tours, Egypt travel agency, Egyptian tour operator, trusted Egypt tours, custom Egypt itineraries',
  openGraph: {
    title: 'About Black Pyramids Tours',
    description: 'Premium Egypt travel agency with 19+ years of expertise in luxury tours, hotels, and custom itineraries.',
  },
};

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <AboutUsPage />
    </div>
  );
}
