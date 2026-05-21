# Hotel Database - Implementation Guide

## Overview
The hotel database has been completely redesigned with 27 professional Egyptian hotels across 10 cities.

## Database Location
**File:** `/data/hotelsData.ts`

## Database Structure

### Hotel Interface
```typescript
interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number; // 3, 4, or 5
  reviewCount: number;
  description: string;
  image: string;
  price: number; // Per night in USD
  amenities: HotelAmenity[];
  rooms: HotelRoom[];
  features: string[];
  checkIn: string;
  checkOut: string;
}
```

### Amenity Structure
```typescript
interface HotelAmenity {
  name: string;
  icon: string; // Emoji icon
}
```

### Room Structure
```typescript
interface HotelRoom {
  type: string; // e.g., "Standard Room", "Deluxe"
  capacity: number; // Number of guests
  price: number; // Per night
  amenities: string[];
}
```

---

## Hotels by City

### CAIRO (3 Hotels)
1. **Nile Hilton Cairo** - 5-star, $450/night
2. **The St. Regis Cairo** - 5-star, $680/night
3. **Marriott Cairo & Omar Khayyam Casino** - 5-star, $380/night

### GIZA (3 Hotels)
1. **Mena House Hotel** - 5-star, $520/night
2. **Kempinski Nile Hotel** - 5-star, $450/night
3. **Le Meridien Pyramids** - 4-star, $280/night

### SHARM EL SHEIKH (3 Hotels)
1. **Ras Nssrani Resort** - 5-star, $380/night
2. **Sofitel Legend Old Town** - 5-star, $420/night
3. **Coral Resort Sharm El Sheikh** - 4-star, $220/night

### HURGHADA (3 Hotels)
1. **Steigenberger Al Dau Beach** - 5-star, $350/night
2. **Hilton Hurghada Nubian Resorts** - 5-star, $320/night
3. **Jasmine Village Resort** - 4-star, $180/night

### LUXOR (3 Hotels)
1. **Sofitel Winter Palace Luxor** - 5-star, $380/night
2. **Hilton Luxor Resort & Spa** - 5-star, $320/night
3. **Steigenberger Nile Palace Luxor** - 4-star, $240/night

### ASWAN (3 Hotels)
1. **Sofitel Aswan Legend** - 5-star, $420/night
2. **Movenpick Aswan** - 5-star, $300/night
3. **Pyramisa Isis Island Hotel** - 4-star, $200/night

### ALEXANDRIA (3 Hotels)
1. **Steigenberger Cecil Hotel Alexandria** - 5-star, $360/night
2. **Hilton Alexandria Green Plaza** - 5-star, $320/night
3. **Metropole Hotel Alexandria** - 4-star, $220/night

### MARSA ALAM (2 Hotels)
1. **Gorgonia Beach Resort** - 5-star, $380/night
2. **Hilton Marsa Alam Nubian Resort** - 5-star, $320/night

### DAHAB (1 Hotel)
1. **Coral Coast Resort** - 5-star, $320/night

### EL GOUNA (1 Hotel)
1. **Sheraton Miramar Resort El Gouna** - 5-star, $340/night

---

## Implementation Details

### Component Using Hotels
**File:** `/components/HotelsPageClientV2.tsx`

**Features:**
- Filter by city
- Filter by star rating
- Filter by price range
- Search functionality
- Responsive hotel cards

### How Filtering Works

1. **City Filter:**
   - "All Cities" or specific city
   - Filters hotels by `hotel.city`

2. **Star Filter:**
   - All ratings, 5-star, 4-star, or 3-star
   - Filters hotels by `hotel.rating`

3. **Price Filter:**
   - Budget ($0-$200)
   - Mid-range ($200-$400)
   - Luxury ($400+)
   - Filters by `hotel.price`

4. **Search:**
   - Searches hotel name, city, description
   - Case-insensitive
   - Real-time results

---

## Adding New Hotels

### Step 1: Add to Database
Edit `/data/hotelsData.ts` and add new hotel object:

```typescript
{
  id: 'cairo-004',
  name: 'New Luxury Hotel',
  location: 'Downtown Cairo, Nile Corniche',
  city: 'Cairo',
  rating: 5,
  reviewCount: 245,
  description: 'Professional description here...',
  image: 'https://images.unsplash.com/....',
  price: 450,
  amenities: [
    { name: 'Free WiFi', icon: '📶' },
    { name: 'Pool', icon: '🏊' },
    // Add more amenities
  ],
  rooms: [
    {
      type: 'Standard Room',
      capacity: 2,
      price: 450,
      amenities: ['AC', 'WiFi', 'Mini Bar']
    },
    // Add more room types
  ],
  features: ['Feature 1', 'Feature 2'],
  checkIn: '2:00 PM',
  checkOut: '11:00 AM',
}
```

### Step 2: Ensure Unique ID
- Format: `{city-lowercase}-{number}`
- Example: `hurghada-004` for 4th Hurghada hotel

### Step 3: Add Image URL
- Use professional hotel images
- Recommended: Unsplash, Pexels
- Format: JPG/PNG, 500x400px minimum

### Step 4: Test
- Run the app
- Verify hotel appears in filters
- Check responsiveness

---

## Editing Existing Hotels

1. Find hotel in `/data/hotelsData.ts`
2. Update fields as needed
3. Keep ID unchanged
4. Update `reviewCount` if needed
5. Save and test

---

## Hotel Fields Explained

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| `id` | string | "cairo-001" | Unique identifier |
| `name` | string | "Nile Hilton" | Hotel name |
| `location` | string | "Downtown Cairo" | Specific location |
| `city` | string | "Cairo" | City for filtering |
| `rating` | number | 5 | 3, 4, or 5 stars |
| `reviewCount` | number | 1245 | Number of reviews |
| `description` | string | "Iconic luxury..." | Hotel description |
| `image` | string | "https://..." | Hotel image URL |
| `price` | number | 450 | USD per night |
| `amenities` | Array | [{name, icon}] | Hotel amenities |
| `rooms` | Array | [{type, capacity, ...}] | Room types |
| `features` | Array | ["Service 1", ...] | Special features |
| `checkIn` | string | "2:00 PM" | Check-in time |
| `checkOut` | string | "11:00 AM" | Check-out time |

---

## Amenity Icons Guide

```
📶 WiFi
🏊 Pool / Swimming
🍽️ Restaurant / Dining
🧖 Spa / Wellness
💪 Fitness / Gym
🎉 Entertainment / Nightclub
🍸 Bar / Drinks
🌊 Beach / Water
⛳ Golf
🐴 Riding / Horses
🎩 Concierge
🍴 Food Service
👑 Luxury / Premium
🕌 Cultural / Religion
🏝️ Island
⛵ Sailing / Boats
🤿 Diving / Water Sports
🏄 Surfing / Water Sports
🌅 Sunset Views
🔺 Pyramid Views
```

---

## API Integration (Future)

### To Connect to Backend:
```typescript
// Instead of static data
const [hotels, setHotels] = useState([]);

useEffect(() => {
  // Fetch from API
  fetch('/api/hotels')
    .then(r => r.json())
    .then(data => setHotels(data));
}, []);
```

---

## Performance Notes

- ✅ 27 hotels load instantly
- ✅ Filtering is real-time
- ✅ Search is optimized
- ✅ Images lazy-loaded
- ✅ Mobile responsive

---

## Search Optimization

Hotels are searchable by:
- Hotel name (exact & partial)
- City name
- Description content
- Amenity names (partial)

Example searches that work:
- "Nile Hilton" → Cairo hotel
- "Cairo" → All Cairo hotels
- "5-star" + "Cairo" → 5-star Cairo hotels
- "$300" (with price filter) → Hotels in range

---

## Popular Hotel Queries

### Most Expensive Hotels
Price range: Luxury ($400+)
Top options: St. Regis Cairo ($680), Sofitel Aswan ($420)

### Best Budget Hotels
Price range: Budget ($0-$200)
Top options: Jasmine Village ($180), Coral Resort Sharm ($220)

### Best Beach Resorts
City: Red Sea cities (Hurghada, Sharm El Sheikh, Marsa Alam)
All feature private beaches & water sports

### Historical Hotels
City: Cairo, Giza, Luxor, Aswan
Features: Museum visits, temple tours, Nile access

---

## WhatsApp Integration

Each hotel has WhatsApp booking link:
```
https://wa.me/201211385550?text=Hi%2C%20I%20would%20like%20to%20book%20${hotelName}...
```

---

## SEO Keywords

Hotels help with SEO for:
- "Egypt hotels"
- "Cairo hotels"
- "Luxury hotels Egypt"
- "Red Sea resorts"
- "[City] accommodations"
- "5-star hotels Egypt"
- "Budget hotels Egypt"
- "Hotel booking Egypt"

---

## Troubleshooting

### Hotel not showing?
1. Check city name matches exactly
2. Verify hotel object syntax
3. Ensure ID is unique
4. Clear browser cache

### Filter not working?
1. Verify `rating` is number (not string)
2. Check `price` is number
3. Ensure `city` matches filter cities list

### Image not loading?
1. Verify URL is correct
2. Check image format (JPG/PNG)
3. Use HTTPS URLs only
4. Test URL in browser directly

---

## Maintenance Schedule

**Weekly:**
- Monitor new hotel requests
- Update pricing if changed
- Fix any reported issues

**Monthly:**
- Add 2-3 new hotels
- Update reviews/ratings
- Check image quality

**Quarterly:**
- Full database review
- Add new cities if needed
- Update descriptions

---

**Database Version:** 1.0
**Last Updated:** May 21, 2026
**Maintenance:** Active
**Status:** Production Ready
