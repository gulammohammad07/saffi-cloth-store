export type FragranceNote = {
  name: string;
  intensity: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  productType: "MEN" | "WOMEN" | "KIDS";
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
  occasions: string[];
  gender: "Unisex" | "Men" | "Women" | "Kids";
  volume: string;
  price: number;
  salePrice?: number;
  image: string;
  video?: string;
  gallery: string[];
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New Arrival" | "Limited Edition" | "Sale";
  featured?: boolean;
  sizes?: { id: string; size: string; price: number; salePrice?: number | null; stock: number }[];
};

export const notes = [
  "Cotton",
  "Linen",
  "Denim",
  "Silk",
  "Velvet",
  "Chiffon",
  "Jersey",
  "Satin",
];

export const occasions = [
  "Wedding",
  "Evening Out",
  "Everyday",
  "Office",
  "Festive",
];

export const testimonials = [
  {
    name: "Ayesha Khan",
    location: "Mumbai",
    rating: 5,
    quote:
      "The fit is impeccable and the fabric feels far more expensive than it is. I've already ordered a second piece in another colour.",
  },
  {
    name: "Rohan Mehta",
    location: "Delhi",
    rating: 5,
    quote:
      "Finally a clothing store that takes craft seriously. The stitching, the curation, the service — everything feels premium. This kurta is my signature now.",
  },
  {
    name: "Priya Sharma",
    location: "Bengaluru",
    rating: 5,
    quote:
      "The co-ord set is the most beautiful thing in my wardrobe. Delivery was swift and the little styling note they send is a lovely touch.",
  },
  {
    name: "Arjun Nair",
    location: "Kochi",
    rating: 4,
    quote:
      "Quality and finish are outstanding — true luxury from start to finish. Sizing guide was spot on.",
  },
  {
    name: "Sana Kapoor",
    location: "Jaipur",
    rating: 5,
    quote:
      "Their collection feels hand-picked. The cotton shirts are subtle yet elegant, perfect for the office. I will definitely be back.",
  },
];
