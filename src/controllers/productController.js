import { Product } from '../models/Product.js';
import mongoose from 'mongoose';

// Initial in-memory fallback catalog in case MongoDB is offline or initial setup
let fallbackProducts = [
  {
    id: 'prod_1',
    _id: 'prod_1',
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
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true }
    ],
    description: 'Masterfully tailored double-breasted trench in raw mulberry silk blend.',
    fabricComposition: '80% Pure Mulberry Silk, 20% Wool Gabardine',
    careInstructions: 'Specialist Dry Clean Only',
    inStock: true
  },
  {
    id: 'prod_2',
    _id: 'prod_2',
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
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: false }
    ],
    description: 'Sculptural cinched blazer with hand-padded shoulders and mother-of-pearl buttons.',
    fabricComposition: '100% Fine Merino Tropical Wool',
    careInstructions: 'Dry Clean Only',
    inStock: true
  },
  {
    id: 'prod_3',
    _id: 'prod_3',
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
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true }
    ],
    description: 'Weightless 22-momme silk crepe blouse with flowing scarf neck tie.',
    fabricComposition: '100% Grade 6A Mulberry Silk',
    careInstructions: 'Dry Clean or Gentle Hand Wash in Cold Water',
    inStock: true
  },
  {
    id: 'prod_4',
    _id: 'prod_4',
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
      { size: '38R', inStock: true },
      { size: '40R', inStock: true },
      { size: '42R', inStock: true }
    ],
    description: 'Italian cut single-breasted suit jacket with structured peak lapels.',
    fabricComposition: '100% Super 130s Virgin Wool',
    careInstructions: 'Dry Clean Only',
    inStock: true
  },
  {
    id: 'prod_5',
    _id: 'prod_5',
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
      { size: 'ONE SIZE', inStock: true }
    ],
    description: 'Full-grain vegetable-tanned leather handcrafted by master Italian artisans.',
    fabricComposition: '100% Full-grain Calfskin, 24k Gold-plated hardware',
    careInstructions: 'Condition with organic leather balm periodically',
    inStock: true
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Get all products (with filters, category, search, sorting)
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, mood, sort, limit, page } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (mood && mood !== 'All') {
        query.mood = mood;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { subtitle: regex },
          { subCategory: regex },
          { mood: regex },
          { description: regex }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      if (sort === 'price-desc') sortOptions = { price: -1 };
      if (sort === 'rating') sortOptions = { rating: -1 };

      const rawProducts = await Product.find(query).sort(sortOptions);
      let productsList = rawProducts;

      // Auto-seed initial catalogue if MongoDB is brand new and empty
      if (rawProducts.length === 0 && (!category || category === 'All') && !search && (!mood || mood === 'All')) {
        try {
          const seeded = await Product.insertMany(fallbackProducts.map(({ id, _id, ...rest }) => rest));
          productsList = seeded;
        } catch (e) {
          productsList = fallbackProducts;
        }
      }

      const formatted = productsList.map(p => {
        const item = p.toObject ? p.toObject() : { ...p };
        item.id = (item._id || item.id || p._id).toString();
        item.primaryImage = item.primaryImage || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85';
        item.secondaryImage = item.secondaryImage || item.primaryImage;
        item.galleryImages = item.galleryImages?.length ? item.galleryImages : [item.primaryImage];
        item.colorVariants = item.colorVariants?.length ? item.colorVariants : [
          { name: 'Standard Edition', hex: '#111111', image: item.primaryImage }
        ];
        item.sizes = item.sizes?.length ? item.sizes : [
          { size: 'XS', inStock: true },
          { size: 'S', inStock: true },
          { size: 'M', inStock: true },
          { size: 'L', inStock: true }
        ];
        return item;
      });

      return res.json({
        success: true,
        count: formatted.length,
        data: formatted
      });
    }

    // Fallback in-memory
    let list = [...fallbackProducts];
    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    if (mood && mood !== 'All') {
      list = list.filter(p => p.mood === mood);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.mood.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
      source: 'memory-fallback'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    }

    const item = fallbackProducts.find(p => p.id === id || p._id === id);
    if (item) {
      return res.json({ success: true, data: item });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new Product (Admin panel)
 */
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    // Default image if not provided
    const primaryImage = body.primaryImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85';
    
    // Parse color variants if stringified
    let colorVariants = body.colorVariants || [
      { name: 'Standard Edition', hex: '#111111', image: primaryImage }
    ];
    if (typeof colorVariants === 'string') {
      try { colorVariants = JSON.parse(colorVariants); } catch (e) {}
    }

    // Parse sizes if stringified
    let sizes = body.sizes || [
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true }
    ];
    if (typeof sizes === 'string') {
      try { sizes = JSON.parse(sizes); } catch (e) {}
    }

    const newProductData = {
      name: body.name,
      subtitle: body.subtitle || 'Daposh Atelier Runway Drop',
      category: body.category,
      subCategory: body.subCategory || 'Ready-to-Wear',
      subType: body.subType || '',
      fit: body.fit || '',
      fabric: body.fabric || '',
      neck: body.neck || '',
      sleeve: body.sleeve || '',
      pattern: body.pattern || '',
      occasion: body.occasion || '',
      season: body.season || '',
      mood: body.mood || 'Minimalist Noir',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      discountPercent: Number(body.discountPercent || 0),
      badge: body.badge || 'New Runway',
      isNew: body.isNew !== undefined ? Boolean(body.isNew) : true,
      isTrending: body.isTrending !== undefined ? Boolean(body.isTrending) : false,
      isBestseller: body.isBestseller !== undefined ? Boolean(body.isBestseller) : false,
      rating: Number(body.rating || 4.9),
      reviewCount: Number(body.reviewCount || 10),
      primaryImage,
      secondaryImage: body.secondaryImage || primaryImage,
      galleryImages: body.galleryImages || [primaryImage],
      colorVariants,
      sizes,
      description: body.description || 'Exclusive luxury haute silhouette crafted with premium precision.',
      fabricComposition: body.fabricComposition || 'Pure Silk & Artisan Weave',
      careInstructions: body.careInstructions || 'Specialist Dry Clean Only',
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true
    };

    if (isDbConnected()) {
      const created = await Product.create(newProductData);
      const obj = created.toObject ? created.toObject() : { ...created._doc };
      obj.id = (obj._id || created._id).toString();
      obj.primaryImage = obj.primaryImage || primaryImage;
      obj.secondaryImage = obj.secondaryImage || obj.primaryImage;
      obj.colorVariants = obj.colorVariants?.length ? obj.colorVariants : [
        { name: 'Standard Edition', hex: '#111111', image: obj.primaryImage }
      ];
      obj.sizes = obj.sizes?.length ? obj.sizes : [
        { size: 'XS', inStock: true },
        { size: 'S', inStock: true },
        { size: 'M', inStock: true },
        { size: 'L', inStock: true }
      ];
      return res.status(201).json({
        success: true,
        message: 'Product published to store successfully!',
        data: obj
      });
    }

    // In-memory fallback
    const mockId = `prod_${Date.now()}`;
    const mockProduct = { ...newProductData, id: mockId, _id: mockId, createdAt: new Date() };
    fallbackProducts.unshift(mockProduct);

    return res.status(201).json({
      success: true,
      message: 'Product added successfully (in-memory mode)!',
      data: mockProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing Product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (updated) {
        return res.json({ success: true, message: 'Product updated successfully', data: updated });
      }
    }

    const index = fallbackProducts.findIndex(p => p.id === id || p._id === id);
    if (index > -1) {
      fallbackProducts[index] = { ...fallbackProducts[index], ...body };
      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: fallbackProducts[index]
      });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a Product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Product removed from collection successfully' });
    }

    const initialLength = fallbackProducts.length;
    fallbackProducts = fallbackProducts.filter(p => p.id !== id && p._id !== id);

    if (fallbackProducts.length < initialLength) {
      return res.json({ success: true, message: 'Product removed from collection successfully' });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get distinct categories & categories metadata
 */
export const getCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { name: 'Topwear', slug: 'topwear', count: 24, description: 'T-shirts, shirts, sweatshirts, sweaters, jackets, blazers & suits' },
      { name: 'Bottomwear', slug: 'bottomwear', count: 18, description: 'Jeans, trousers, cargos, joggers, track pants & shorts' },
      { name: 'Ethnic and Festive', slug: 'ethnic-and-festive', count: 16, description: 'Kurtas, sherwanis, kurta-pyjama sets & Nehru jackets' },
      { name: 'Co-ord Sets', slug: 'co-ord-sets', count: 10, description: 'T-shirt + shorts, shirt + trousers, tracksuits & linen sets' },
      { name: 'Activewear', slug: 'activewear', count: 12, description: 'Gym tees, dry-fit tops, sports shorts & compression wear' },
      { name: 'Winterwear', slug: 'winterwear', count: 14, description: 'Hoodies, sweaters, jackets, thermals, mufflers & beanies' },
      { name: 'Innerwear and Loungewear', slug: 'innerwear-and-loungewear', count: 15, description: 'Briefs, trunks, boxers, vests & night suits' },
      { name: 'Footwear', slug: 'footwear', count: 12, description: 'Sneakers, sports shoes, loafers, formal shoes & mojaris' },
      { name: 'Accessories', slug: 'accessories', count: 20, description: 'Belts, wallets, caps, sunglasses, watches & ties' },
      { name: 'Women', slug: 'women', count: 18, description: 'Haute couture gowns, silk blouses, blazers & bespoke sets' },
      { name: 'Men', slug: 'men', count: 25, description: 'Sartorial tailoring, Italian suits, overcoats & shirts' },
      { name: 'Atelier Studio', slug: 'atelier-studio', count: 8, description: 'Limited runway archival and numbered pieces' }
    ];

    return res.json({
      success: true,
      data: defaultCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
