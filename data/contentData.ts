export interface SiteContent {
  id: string;
  section: string;
  key: string;
  label: string;
  value: string;
}

export const initialContent: SiteContent[] = [
  // Home Page Section
  {
    id: 'home-hero-kicker',
    section: 'Home Hero',
    key: 'heroKicker',
    label: 'Hero Kicker Text',
    value: 'EXCLUSIVE TRAVEL SERVICES'
  },
  {
    id: 'home-hero-title',
    section: 'Home Hero',
    key: 'heroTitle',
    label: 'Hero Main Title',
    value: 'Your Gateway to Egypt\'s Ancient Wonders'
  },
  {
    id: 'home-hero-subtitle',
    section: 'Home Hero',
    key: 'heroSubtitle',
    label: 'Hero Subtitle Text',
    value: 'Specializing in private guided Egyptologist tours, handpicked five-star hotels, and premium chauffeur VIP transfers since 2005.'
  },
  
  // Promotions
  {
    id: 'promo-title',
    section: 'Promotions',
    key: 'promoTitle',
    label: 'Promotion Banner Title',
    value: 'Plan a Custom Expedition'
  },
  {
    id: 'promo-text',
    section: 'Promotions',
    key: 'promoText',
    label: 'Promotion Detail Description',
    value: 'Book any 3 signature luxury guided tours and obtain the 4th tour completely complimentary! Experience Egypt like royalty.'
  },

  // About Section
  {
    id: 'about-heading',
    section: 'About Us',
    key: 'aboutHeading',
    label: 'About Section Heading',
    value: 'Luxury hospitality aligned with the Black Pyramids style'
  },
  {
    id: 'about-mission',
    section: 'About Us',
    key: 'aboutMission',
    label: 'Mission Statement Statement',
    value: 'Every hotel in this collection is selected to complement a premium Egypt journey, with standout design, service quality, location value, and atmosphere that suits bespoke cultural, leisure, and family travel.'
  },

  // Contact Info
  {
    id: 'contact-phone',
    section: 'Contact Info',
    key: 'phone',
    label: 'Agency WhatsApp Phone Number',
    value: '+201211385550'
  },
  {
    id: 'contact-email',
    section: 'Contact Info',
    key: 'email',
    label: 'Agency Support Email Address',
    value: 'info@blackpyramidstours.com'
  },
  {
    id: 'contact-address',
    section: 'Contact Info',
    key: 'address',
    label: 'Agency Office Location Address',
    value: 'Giza, Pyramids Plateau Area, Egypt'
  }
];
