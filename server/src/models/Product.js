import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Price must be positive'],
  },
  stockQty: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock quantity cannot be negative'],
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  unit: {
    type: String,
    default: 'pcs', // e.g. kg, pcs, bottle, pack
  }
}, {
  timestamps: true,
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
