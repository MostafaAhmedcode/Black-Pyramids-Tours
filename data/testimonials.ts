export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
  tourorhotel: string;
}

export const customerTestimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Sarah Johnson',
    location: 'United States',
    rating: 5,
    text: 'Black Pyramids Tours made our Egypt adventure absolutely incredible! From the moment we arrived, everything was perfectly organized. Our guide was knowledgeable and friendly, the hotels were luxurious, and the experiences were unforgettable. We felt safe and well cared for throughout the entire trip. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tourorhotel: 'Cairo & Luxor Tour',
  },
  {
    id: 'test-002',
    name: 'Marco Rossi',
    location: 'Italy',
    rating: 5,
    text: 'Fantastico! I traveled solo with Black Pyramids Tours and had the best experience. The team was incredibly helpful, the itinerary was perfect, and I made friends with other travelers. The Red Sea resort was stunning, and I even got my diving certification! Worth every penny.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    tourorhotel: 'Red Sea Diving Expedition',
  },
  {
    id: 'test-003',
    name: 'Aisha Malik',
    location: 'United Kingdom',
    rating: 5,
    text: 'Amazing honeymoon package! Black Pyramids Tours understood exactly what we wanted - romance, adventure, and luxury. The private Nile cruise was magical, the meals were delicious, and the spa treatments were divine. Thank you for making our honeymoon so special!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    tourorhotel: 'Romantic Nile Cruise',
  },
  {
    id: 'test-004',
    name: 'David Chen',
    location: 'Singapore',
    rating: 5,
    text: 'As a photographer, I was extremely particular about the tour quality. Black Pyramids Tours exceeded all expectations! The guides knew the best photography spots, timing was perfect for golden hour, and the logistics were seamless. Got incredible shots and had an amazing trip!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    tourorhotel: 'Photography & History Tour',
  },
  {
    id: 'test-005',
    name: 'Emma Thompson',
    location: 'Canada',
    rating: 5,
    text: 'We traveled as a family with kids aged 8 and 12. The team made sure every activity was engaging for them. They learned so much about Egyptian history while having fun! The camel riding and desert safari were highlights for the kids. Best family vacation ever!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tourorhotel: 'Family Egypt Adventure',
  },
  {
    id: 'test-006',
    name: 'Klaus Weber',
    location: 'Germany',
    rating: 5,
    text: 'Ich bin sehr begeistert von diesem Reiseunternehmen! Die Unterkunftsqualität, die Guides und der Kundenservice waren exzellent. Ich bin sowohl geschichtlich als auch kulturell bereichert zurückgekommen. Ich werde sicherlich wiederkommen!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    tourorhotel: 'Nile Cruise & Historical Tour',
  },
  {
    id: 'test-007',
    name: 'Priya Sharma',
    location: 'India',
    rating: 5,
    text: 'Excellent service! The team understood our preferences perfectly and customized the itinerary accordingly. The Aswan Nile cruise was peaceful and rejuvenating. Every meal was thoughtfully planned. We brought back memories and friends from the group tour. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tourorhotel: 'Aswan & Abu Simbel Explorer',
  },
  {
    id: 'test-008',
    name: 'Pierre Dubois',
    location: 'France',
    rating: 5,
    text: 'Magnifique! From booking to return, everything was handled with care and professionalism. The Luxor hotels were luxurious, the guides spoke perfect English and French, and the experiences were authentic. I recommend Black Pyramids Tours to all my friends!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    tourorhotel: 'Luxor & Valley of Kings',
  },
];
