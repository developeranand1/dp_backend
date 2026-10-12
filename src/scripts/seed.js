import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';

dotenv.config();

const initialCategories = [
  { name: 'Women', slug: 'women', description: 'Haute couture gowns, silk blouses, tailored blazers', subCategories: ['Trench Coats', 'Silk Blouses', 'Tailored Blazers', 'Evening Gowns'] },
  { name: 'Men', slug: 'men', description: 'Sartorial tailoring, wool overcoats & Italian suits', subCategories: ['Tailored Blazers', 'Overcoats', 'Silk Shirts', 'Trousers'] },
  { name: 'Atelier Studio', slug: 'atelier-studio', description: 'Limited runway archival and numbered collector pieces', subCategories: ['Couture Gowns', 'Limited Editions'] },
  { name: 'Accessories', slug: 'accessories', description: 'Full-grain calfskin bags, silk scarves & fine jewelry', subCategories: ['Leather Bags', 'Silk Scarves', 'Belts'] },
  { name: 'Footwear', slug: 'footwear', description: 'Artisan handcrafted Italian leather loafers & mules', subCategories: ['Loafers', 'Boots', 'Mules'] }
];

const initialProducts = [
  {
    name: 'Atelier Mulberry Silk Trench',
    subtitle: 'Fall/Winter Haute Edition',
    category: 'Women',
    subCategory: 'Trench Coats',
    mood: 'Parisian Chic',
    price: 18500,
    originalPrice: 24500,
    discountPercent: 25,
    badge: 'Runway SS26',
    isNew: true,
    isTrending: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 38,
    primaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    colorVariants: [
      { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85' },
      { name: 'Champagne Dune', hex: '#d9c7a7', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: [
      { size: 'XS', inStock: true, stockCount: 15 },
      { size: 'S', inStock: true, stockCount: 22 },
      { size: 'M', inStock: true, stockCount: 18 },
      { size: 'L', inStock: true, stockCount: 8 }
    ],
    description: 'Masterfully tailored double-breasted trench in raw mulberry silk blend, featuring horn buttons, belted cuff details and storm flap.',
    fabricComposition: '80% Pure Mulberry Silk, 20% Wool Gabardine',
    careInstructions: 'Specialist Dry Clean Only. Store in breathable canvas garment bag.',
    inStock: true
  },
  {
    name: 'Midnight Architectural Blazer',
    subtitle: 'Sartorial Power Tailoring',
    category: 'Women',
    subCategory: 'Tailored Blazers',
    mood: 'Minimalist Noir',
    price: 14200,
    originalPrice: 17800,
    discountPercent: 20,
    badge: 'Atelier Exclusive',
    isNew: true,
    isTrending: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 29,
    primaryImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
    ],
    colorVariants: [
      { name: 'Midnight Charcoal', hex: '#1f2022', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: [
      { size: 'S', inStock: true, stockCount: 14 },
      { size: 'M', inStock: true, stockCount: 9 },
      { size: 'L', inStock: false, stockCount: 0 }
    ],
    description: 'Sculptural cinched blazer with hand-padded shoulders, mother-of-pearl buttons and silk satin peak lapels.',
    fabricComposition: '100% Fine Merino Tropical Wool',
    careInstructions: 'Dry Clean Only',
    inStock: true
  },
  {
    name: 'Riviera Fluid Silk Blouse',
    subtitle: 'Effortless Draped Silhouette',
    category: 'Women',
    subCategory: 'Silk Blouses',
    mood: 'Riviera Linen',
    price: 8900,
    originalPrice: 11000,
    discountPercent: 19,
    badge: 'Pure Mulberry Silk',
    isNew: false,
    isTrending: true,
    isBestseller: false,
    rating: 5.0,
    reviewCount: 14,
    primaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85'
    ],
    colorVariants: [
      { name: 'Ivory Crème', hex: '#f6f1e8', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: [
      { size: 'XS', inStock: true, stockCount: 10 },
      { size: 'S', inStock: true, stockCount: 15 },
      { size: 'M', inStock: true, stockCount: 12 }
    ],
    description: 'Weightless 22-momme silk crepe blouse with flowing scarf neck tie and billowed French cuffs.',
    fabricComposition: '100% Grade 6A Mulberry Silk',
    careInstructions: 'Dry Clean or Gentle Hand Wash in Cold Water',
    inStock: true
  },
  {
    name: 'Milano Single-Breasted Tailored Suit',
    subtitle: 'Sharp Executive Line',
    category: 'Men',
    subCategory: 'Tailored Blazers',
    mood: 'Urban Studio',
    price: 26500,
    originalPrice: 32000,
    discountPercent: 17,
    badge: 'Limited Edition',
    isNew: true,
    isTrending: true,
    isBestseller: false,
    rating: 4.9,
    reviewCount: 22,
    primaryImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    colorVariants: [
      { name: 'Bespoke Navy', hex: '#121b2d', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: [
      { size: '38R', inStock: true, stockCount: 8 },
      { size: '40R', inStock: true, stockCount: 10 },
      { size: '42R', inStock: true, stockCount: 6 }
    ],
    description: 'Italian cut single-breasted suit jacket with structured peak lapels and full canvas construction.',
    fabricComposition: '100% Super 130s Virgin Wool',
    careInstructions: 'Dry Clean Only',
    inStock: true
  },
  {
    name: 'Artisan Calfskin Saddle Crossbody',
    subtitle: 'Hand-burnished Edge Luxury',
    category: 'Accessories',
    subCategory: 'Leather Bags',
    mood: 'Old Money Luxe',
    price: 11500,
    originalPrice: 15000,
    discountPercent: 23,
    badge: 'Conscious Luxe',
    isNew: false,
    isTrending: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 45,
    primaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
    secondaryImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
    ],
    colorVariants: [
      { name: 'Cognac Saddle', hex: '#874c26', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85' }
    ],
    sizes: [
      { size: 'ONE SIZE', inStock: true, stockCount: 25 }
    ],
    description: 'Full-grain vegetable-tanned leather handcrafted by master Italian artisans.',
    fabricComposition: '100% Full-grain Calfskin, 24k Gold-plated hardware',
    careInstructions: 'Condition with organic leather balm periodically',
    inStock: true
  }
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/daposh_fashion';
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB for seeding...');

    await Category.deleteMany({});
    await Category.insertMany(initialCategories);
    console.log(` Seeded ${initialCategories.length} categories.`);

    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log(` Seeded ${initialProducts.length} products.`);

    console.log(' Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
