export interface TransferItem {
  id: string;
  title: string;
  desc: string;
  price: number; // Stored as a base price number (e.g., 25 for $25)
  icon: string;
}

export const initialTransfers: TransferItem[] = [
  {
    id: 'cairo-airport',
    title: 'Cairo International Airport (CAI)',
    desc: 'Premium meet & greet service at the arrivals hall. Private air-conditioned luxury car direct to our hotel or any location in Giza/Cairo.',
    price: 25,
    icon: '✈️'
  },
  {
    id: 'sphinx-airport',
    title: 'Sphinx International Airport (SPX)',
    desc: 'Quick and seamless direct transfer from Sphinx Airport to the Pyramids area and hotels in Giza.',
    price: 25,
    icon: '✈️'
  },
  {
    id: 'giza-pyramids-local',
    title: 'Local Giza, Pyramids & Old Cairo',
    desc: 'Any local one-way transfer inside Giza, the Pyramids area, and historic Old Cairo in our modern air-conditioned vehicles.',
    price: 20,
    icon: '📍'
  },
  {
    id: 'cairo-station',
    title: 'Cairo Railway Station (Ramses)',
    desc: 'Seamless direct pickup or drop-off from Ramses Train Station (Cairo Station) or Giza Station with luggage assistance.',
    price: 20,
    icon: '🚆'
  },
  {
    id: 'private-car-driver',
    title: 'Private Car & Professional Driver (Full Day)',
    desc: 'Hire a private air-conditioned high-class car and dedicated driver for your custom sightseeing itinerary in Egypt.',
    price: 40,
    icon: '🚗'
  }
];
