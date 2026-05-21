import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import TeamPageClient from '@/components/TeamPageClient';

export const metadata: Metadata = {
  title: 'Our Team | English-Speaking Guides & Staff | Black Pyramids Tours',
  description: 'Meet the Black Pyramids Tours team — licensed Egyptologist guides, professional drivers, and planning specialists. All fluent English speakers dedicated to your Egypt experience.',
  keywords: 'English speaking tour guide Egypt, licensed Egyptologist Cairo, Egypt tour guide, English speaking agency staff Giza, professional Egypt guide',
  openGraph: {
    title: 'Our Team | Black Pyramids Tours',
    description: 'Licensed Egyptologist guides, professional drivers, and agency staff — all fluent English speakers.',
    images: [{ url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&h=630&fit=crop', width: 1200, height: 630 }],
  },
};

export default function TeamPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', color: '#fff' }}>
      <Navbar />
      <TeamPageClient />
    </div>
  );
}
