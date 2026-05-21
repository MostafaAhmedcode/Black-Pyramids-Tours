import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HotelsPageClientV2 from '@/components/HotelsPageClientV2';

export const metadata: Metadata = {
  title: 'Luxury Hotels Across Egypt | Cairo, Giza, Red Sea, Luxor | Black Pyramids Tours',
  description: 'Book premium hotels across Egypt - Cairo, Giza, Sharm El Sheikh, Hurghada, Luxor, Aswan, Alexandria, & more. 5-star resorts with diving, Nile views, and luxury amenities. WhatsApp booking available.',
  keywords: 'Egypt hotels, Cairo hotels, Giza hotels, Red Sea resorts, Hurghada hotels, Luxor hotels, Aswan hotels, Egypt accommodations, luxury hotels Egypt, hotel booking Egypt',
  openGraph: {
    title: 'Premium Hotels Across Egypt | Black Pyramids Tours',
    description: 'Discover luxury accommodations across all of Egypt - 5-star hotels in Cairo, Giza, Red Sea resorts, Nile cruises, and historical cities.',
    images: [{ url: 'https://images.unsplash.com/photo-1542314503-37143078c4c1?w=1200&h=630&fit=crop', width: 1200, height: 630 }],
  },
};

export default function HotelsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Navbar />
      <HotelsPageClientV2 />
    </div>
  );
}
