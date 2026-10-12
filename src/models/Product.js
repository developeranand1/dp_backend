import mongoose from 'mongoose';

const colorVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#000000' },
  image: { type: String, required: true }
}, { _id: false });

const sizeOptionSchema = new mongoose.Schema({
  size: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 20 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  subtitle: {
    type: String,
    default: 'Artisanal Silhouette'
  },
  category: {
    type: String,
    required: true,
    enum: ['Women', 'Men', 'Atelier Studio', 'Accessories', 'Footwear'],
    default: 'Women'
  },
  subCategory: {
    type: String,
    default: 'Ready-to-Wear'
  },
  mood: {
    type: String,
    default: 'Minimalist Noir'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    default: 'Atelier Selection'
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 4.9
  },
  reviewCount: {
    type: Number,
    default: 18
  },
  primaryImage: {
    type: String,
    required: [true, 'Primary image is required']
  },
  secondaryImage: {
    type: String,
    default: ''
  },
  galleryImages: {
    type: [String],
    default: []
  },
  colorVariants: {
    type: [colorVariantSchema],
    default: []
  },
  sizes: {
    type: [sizeOptionSchema],
    default: [
      { size: 'XS', inStock: true },
      { size: 'S', inStock: true },
      { size: 'M', inStock: true },
      { size: 'L', inStock: true }
    ]
  },
  description: {
    type: String,
    default: ''
  },
  fabricComposition: {
    type: String,
    default: '100% Pure Mulberry Silk / Hand-tailored'
  },
  careInstructions: {
    type: String,
    default: 'Dry Clean Only. Handled with white-glove artisan care.'
  },
  modelSpecs: {
    type: String,
    default: 'Model is 5\'10" (178cm), wearing Size S'
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

// Index for search & category filtering
productSchema.index({ name: 'text', description: 'text', subCategory: 'text' });
productSchema.index({ category: 1, price: 1 });

export const Product = mongoose.model('Product', productSchema);
