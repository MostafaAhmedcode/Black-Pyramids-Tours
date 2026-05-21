import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import FAQPage from '@/components/FAQPage';

export const metadata: Metadata = {
  title: 'FAQ | Egypt Travel Tips | Black Pyramids Tours',
  description: 'Frequently asked questions about Egypt travel, booking tours, hotel reservations, visa information, best time to visit, and more.',
  keywords: 'Egypt travel FAQ, Egypt tour questions, hotel booking FAQ, Egypt travel tips, visa information',
  openGraph: {
    title: 'FAQ - Egypt Travel Questions Answered',
    description: 'Find answers to common questions about Egypt travel, tours, accommodations, and our services.',
  },
};

export default function FAQPageRoute() {
  return (
    <div>
      <Navbar />
      <FAQPage />
    </div>
  );
}
