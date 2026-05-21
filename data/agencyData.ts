export interface RoomType {
  name: "Standard" | "Deluxe" | "Suite";
  description: string;
  price: number;
  size: string;
  view: string;
  capacity: number;
  highlights: string[];
}

export interface Hotel {
  id: number;
  name: string;
  stars: 3 | 4 | 5;
  location: string;
  image: string;
  basePrice: number;
  amenities: ("WiFi" | "Pool" | "Breakfast" | "AC")[];
  description: string;
  viewDescription: string;
  rooms: {
    Standard: RoomType;
    Deluxe: RoomType;
    Suite: RoomType;
  };
}

export interface AgencyTour {
  id: number;
  title: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  price: number;
  included: string[];
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
}

export interface Destination {
  id: number;
  name: string;
  tagline: string;
  image: string;
  emoji: string;
}

export interface Testimonial {
  id: number;
  name: string;
  country: string;
  flag: string;
  rating: number;
  text: string;
  avatar: string;
}

export const featuredHotels: Hotel[] = [
  {
    id: 1,
    name: "Marriott Mena House",
    stars: 5,
    location: "Pyramids View, Giza",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&fit=crop",
    basePrice: 180,
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    description: "Nestled in the shadow of the Great Pyramids of Giza, this historic palace has hosted kings and emperors since 1869. Surrounded by 40 acres of lush green gardens, it offers royal hospitality with modern sophistication.",
    viewDescription: "Stunning, direct views of the ancient Pyramids of Giza.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Elegant room featuring classical Arabian design motifs, plush bedding, and an internal garden view.",
        price: 180,
        size: "36 m² (387 ft²)",
        view: "Internal Garden View",
        capacity: 2,
        highlights: ["Premium Bedding", "Classical Design", "Rainfall Shower"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Spacious deluxe room with high-ceiling design, private balcony, and partial views of the Great Pyramids.",
        price: 290,
        size: "40 m² (430 ft²)",
        view: "Partial Pyramid View",
        capacity: 2,
        highlights: ["Private Balcony", "Marble Bathroom", "Coffee Station"]
      },
      Suite: {
        name: "Suite",
        description: "Opulent executive suite on the palace wing, offering a magnificent direct view of the Pyramids from your private terrace.",
        price: 520,
        size: "72 m² (775 ft²)",
        view: "Direct Pyramid View",
        capacity: 3,
        highlights: ["Direct Pyramid View", "Private Terrace", "Dedicated Living Room"]
      }
    }
  },
  {
    id: 2,
    name: "Kempinski Nile Hotel",
    stars: 5,
    location: "Downtown Cairo",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&fit=crop",
    basePrice: 160,
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    description: "Located on the majestic banks of the Nile in Cairo's affluent Garden City district. Combining European luxury with warm Egyptian charm, it features a panoramic rooftop pool, exquisite dining, and round-the-clock butler service.",
    viewDescription: "Panoramic views of the Nile River and Cairo skyline.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Contemporary and stylish room with custom luxury furnishings and views of Cairo's historic diplomatic quarter.",
        price: 160,
        size: "34 m² (365 ft²)",
        view: "City View",
        capacity: 2,
        highlights: ["24-Hour Butler", "Work Desk", "Plush Bathrobes"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Beautifully designed Nile-view room featuring floor-to-ceiling windows and a private balcony overlooking the water.",
        price: 250,
        size: "38 m² (409 ft²)",
        view: "Nile River View",
        capacity: 2,
        highlights: ["Floor-to-ceiling Windows", "Nile View", "Marble Bath"]
      },
      Suite: {
        name: "Suite",
        description: "Expansive Nile Suite with a separate elegant living room, state-of-the-art entertainment center, and butler service.",
        price: 450,
        size: "68 m² (730 ft²)",
        view: "Panoramic Nile View",
        capacity: 3,
        highlights: ["Panoramic Nile View", "Separate Lounge", "Personalized Butler Service"]
      }
    }
  },
  {
    id: 3,
    name: "Steigenberger Cecil",
    stars: 4,
    location: "Alexandria Corniche",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80&fit=crop",
    basePrice: 110,
    amenities: ["WiFi", "Breakfast", "AC"],
    description: "Built in 1929, this legendary hotel sits in a prime location on Alexandria's Mediterranean corniche. Famed for its elegant historic architecture, vintage elevators, and prestigious guest list, it represents old-world seaside luxury.",
    viewDescription: "Mesmerizing views of the Mediterranean Sea and Alexandria Harbor.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Quaint, heritage-styled room reflecting early 20th-century classical Alexandria architecture.",
        price: 110,
        size: "28 m² (301 ft²)",
        view: "City View",
        capacity: 1,
        highlights: ["Vintage Decor", "Heritage High Ceilings", "Free High-speed WiFi"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Splendid heritage room with a private balcony directly facing the harbor and Mediterranean waters.",
        price: 180,
        size: "32 m² (344 ft²)",
        view: "Sea View",
        capacity: 2,
        highlights: ["Sea View Balcony", "Premium Egyptian Linen", "LCD Satellite TV"]
      },
      Suite: {
        name: "Suite",
        description: "Historic grand suite with a large panoramic sea-facing balcony, rich carpets, antique styling, and living area.",
        price: 310,
        size: "55 m² (592 ft²)",
        view: "Panoramic Sea View",
        capacity: 2,
        highlights: ["Panoramic Sea Balcony", "Historic Antique Furniture", "Separate Dining Area"]
      }
    }
  },
  {
    id: 4,
    name: "Sofitel Legend Old Cataract",
    stars: 5,
    location: "Aswan",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&fit=crop",
    basePrice: 280,
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    description: "An iconic Victorian palace rising majestically from a pink granite shelf on the banks of the Nile. Agatha Christie wrote Death on the Nile here; this legendary monument merges French art de vivre with historic pharaonic luxury.",
    viewDescription: "Dramatic views of the Nile River, Elephantine Island, and Nubian desert hills.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Beautifully styled room on the modern Nile Wing, featuring bright Nubian colors and contemporary luxury.",
        price: 280,
        size: "36 m² (387 ft²)",
        view: "Garden View",
        capacity: 2,
        highlights: ["Nubian Aesthetics", "Luxury Linens", "Soaking Tub"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Stately room inside the historic Palace Wing, loaded with rich fabrics, high ceilings, and a balcony directly over the Nile.",
        price: 420,
        size: "42 m² (452 ft²)",
        view: "Nile River View",
        capacity: 2,
        highlights: ["Palace Wing Heritage", "Balcony over the Nile", "Espresso Machine"]
      },
      Suite: {
        name: "Suite",
        description: "The ultimate royal suite with an expansive terrace overlooking the Nile, premium luxury amenities, and private butler.",
        price: 790,
        size: "80 m² (861 ft²)",
        view: "Panoramic Nile & Desert View",
        capacity: 3,
        highlights: ["Huge Nile-view Terrace", "Agatha Christie Vibe", "Royal Butler Service"]
      }
    }
  },
  {
    id: 5,
    name: "Hilton Luxor Resort",
    stars: 4,
    location: "Luxor",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&fit=crop",
    basePrice: 120,
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    description: "A tranquil resort sanctuary located on the peaceful East Bank of the Nile, just minutes from the majestic Karnak Temple. With an award-winning infinity pool and an upscale luxury spa, it offers a peaceful retreat after exploring ancient ruins.",
    viewDescription: "Restful views of the Nile River and private tropical courtyards.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Serene resort room overlooking the internal tropical courtyard gardens, providing absolute quiet.",
        price: 120,
        size: "32 m² (344 ft²)",
        view: "Courtyard Garden View",
        capacity: 2,
        highlights: ["Quiet Location", "Modern Minimalist Design", "AC with Climate Control"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Luxury pool-facing room with private sliding glass doors opening to steps near the infinity pool.",
        price: 190,
        size: "36 m² (387 ft²)",
        view: "Nile & Pool View",
        capacity: 2,
        highlights: ["Direct Pool Access", "Nile View", "Plush Bath Amenities"]
      },
      Suite: {
        name: "Suite",
        description: "Opulent sanctuary suite featuring a massive balcony directly above the Nile water and a personal open-air jacuzzi.",
        price: 340,
        size: "62 m² (667 ft²)",
        view: "Direct Nile View",
        capacity: 3,
        highlights: ["Private Jacuzzi Balcony", "Direct Nile View", "Separate Lounge Area"]
      }
    }
  },
  {
    id: 6,
    name: "Baron Palace",
    stars: 5,
    location: "Hurghada",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80&fit=crop",
    basePrice: 220,
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    description: "An elegant, Mediterranean-palace-inspired luxury beachfront resort in Hurghada's exclusive Sahl Hasheesh Bay. It offers a private white-sand beach, a vast complex of infinity pools, and premier coral reef diving access.",
    viewDescription: "Turquoise Red Sea beachfront and sparkling pool views.",
    rooms: {
      Standard: {
        name: "Standard",
        description: "Spacious luxury room in the resort wing, featuring sleek designer furnishings and courtyard garden views.",
        price: 220,
        size: "45 m² (484 ft²)",
        view: "Courtyard View",
        capacity: 2,
        highlights: ["Spacious Layout", "Dressing Area", "Luxury Toiletries"]
      },
      Deluxe: {
        name: "Deluxe",
        description: "Premium seafront room with a spacious balcony overlooking the azure waters of the Red Sea.",
        price: 350,
        size: "48 m² (516 ft²)",
        view: "Front Sea View",
        capacity: 2,
        highlights: ["Seafront Balcony", "King Size Bed", "Free Daily Fruit Basket"]
      },
      Suite: {
        name: "Suite",
        description: "Grand beachfront suite with a private infinity plunge pool, expansive seaside sun deck, and club lounge access.",
        price: 620,
        size: "95 m² (1022 ft²)",
        view: "Front Beachfront View",
        capacity: 3,
        highlights: ["Private Sun Deck & Plunge Pool", "Front Beachfront", "Baron Club Lounge Access"]
      }
    }
  }
];

export const featuredTours: AgencyTour[] = [
  {
    id: 1,
    title: "Cairo Day Tour",
    duration: "8 Hours",
    difficulty: "Easy",
    price: 65,
    included: ["Private A/C Transport", "English Guide", "Traditional Lunch"],
    description: "Explore the ancient world's crown jewels: the Giza Pyramids Complex, the Great Sphinx, and the classical Egyptian Museum. Guided by a certified, expert English-speaking Egyptologist in a private luxury car.",
    image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80&fit=crop",
    rating: 4.9,
    reviewsCount: 534
  },
  {
    id: 2,
    title: "Luxor Temple Night Tour",
    duration: "4 Hours",
    difficulty: "Easy",
    price: 45,
    included: ["Private A/C Transport", "English Guide", "Evening Tea"],
    description: "Experience the magic of Ancient Thebes after sunset. Witness the colossal statues and soaring obelisks of Luxor Temple and Karnak Temple illuminated by dramatic lights under a starry night sky.",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80&fit=crop",
    rating: 4.8,
    reviewsCount: 216
  },
  {
    id: 3,
    title: "Nile Cruise 4 Days",
    duration: "4 Days / 3 Nights",
    difficulty: "Medium",
    price: 380,
    included: ["Nile Cruise Suite", "Guided Sightseeing", "All Meals", "All Transfers"],
    description: "Sail back in time from Aswan to Luxor aboard a luxury 5-star Nile cruise ship. Includes custom private excursions to Abu Simbel, Kom Ombo Temple, Edfu Temple, Philae Temple, and the Valley of the Kings.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80&fit=crop",
    rating: 4.95,
    reviewsCount: 412
  },
  {
    id: 4,
    title: "Sinai Desert Safari",
    duration: "6 Hours",
    difficulty: "Medium",
    price: 80,
    included: ["Quad Biking", "Bedouin Dinner", "Camel Riding", "Stargazing Guide"],
    description: "Embark on an unforgettable Sahara adventure from Sharm El Sheikh or Dahab. Ride quad bikes through wind-swept canyons, mount a camel at sunset, and dine in a traditional Bedouin camp under a blanket of desert stars.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80&fit=crop",
    rating: 4.75,
    reviewsCount: 198
  },
  {
    id: 5,
    title: "Alexandria Historical Tour",
    duration: "10 Hours",
    difficulty: "Medium",
    price: 90,
    included: ["Private A/C Transport", "English Guide", "Seafood Lunch"],
    description: "Discover Egypt's Greco-Roman seaside jewel. Tour the rock-cut Catacombs of Kom El Shoqafa, Pompey's Pillar, the imposing Citadel of Qaitbay overlooking the Mediterranean, and the majestic Bibliotheca Alexandrina.",
    image: "https://images.unsplash.com/photo-1500595046891-b23dfb9ee8b7?w=800&q=80&fit=crop",
    rating: 4.8,
    reviewsCount: 147
  },
  {
    id: 6,
    title: "Aswan & Abu Simbel",
    duration: "12 Hours",
    difficulty: "Hard",
    price: 150,
    included: ["Private Transport", "Abu Simbel Tickets", "English Guide", "Lunch Box"],
    description: "Journey deep into Nubia to witness the colossal sun temples of Ramses II and Nefertari carved into the sandstone cliffs at Abu Simbel. Return to Aswan for a relaxing private felucca sailboat cruise around Elephantine Island.",
    image: "https://images.unsplash.com/photo-1568050467196-35e5f0db3c45?w=800&q=80&fit=crop",
    rating: 4.9,
    reviewsCount: 312
  }
];

export const topDestinations: Destination[] = [
  { id: 1, name: "Cairo", tagline: "Giza Pyramids & Islamic heritage", image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600&q=80&fit=crop", emoji: "🕌" },
  { id: 2, name: "Luxor", tagline: "World's greatest open-air museum", image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&q=80&fit=crop", emoji: "🔺" },
  { id: 3, name: "Aswan", tagline: "Granite cataracts & Nubian color", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&fit=crop", emoji: "⛵" },
  { id: 4, name: "Hurghada", tagline: "Red Sea reefs & sandy beaches", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&fit=crop", emoji: "🐠" },
  { id: 5, name: "Alexandria", tagline: "Greco-Roman history & seaside cafes", image: "https://images.unsplash.com/photo-1500595046891-b23dfb9ee8b7?w=600&q=80&fit=crop", emoji: "🌊" },
  { id: 6, name: "Siwa", tagline: "Mystic desert salt lakes & old fortress", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80&fit=crop", emoji: "🌴" },
  { id: 7, name: "Dahab", tagline: "Bohemian vibes & deep blue hole", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fit=crop", emoji: "🤿" },
  { id: 8, name: "Sharm El Sheikh", tagline: "World-class luxury dive resorts", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&fit=crop", emoji: "🐬" }
];

export const guestTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    country: "United States",
    flag: "🇺🇸",
    rating: 5,
    text: "Black Pyramids Tours crafted the perfect 2-week itinerary! Our private guides in Cairo and Luxor were incredibly knowledgeable. Everything was absolutely seamless. 10/10 recommended!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Pierre Laurent",
    country: "France",
    flag: "🇫🇷",
    rating: 5,
    text: "The luxury transport transfers were so comfortable, and the hotel selections (especially Sofitel Old Cataract in Aswan) were absolute perfection. Expert booking team, brilliant guides!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Emily Watson",
    country: "United Kingdom",
    flag: "🇬🇧",
    rating: 5,
    text: "Booking through WhatsApp was incredibly fast and easy. The team's English is absolutely perfect, from drivers to guides. Best travel agency in Egypt by far!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];
