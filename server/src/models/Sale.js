import mongoose from 'mongoose';

export const ALLOWED_PAYMENT_METHODS = [
  'Cash',
  'Telebirr',
  'CBE',
  'CBE Birr',
  'Coop Bank',
  'Awash Bank',
  'Sinqee Bank',
  'Abyssinia Bank',
  'Credit',
  'Other'
];

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required'],
  },
  productName: {
    type: String, // Cached for easy historical display even if product is renamed
  },
  quantitySold: {
    type: Number,
    required: [true, 'Quantity sold is required'],
    min: [0.001, 'Must sell greater than 0 units'],
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ALLOWED_PAYMENT_METHODS,
      message: '{VALUE} is not a supported payment method'
    },
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Credit'],
    default: 'Paid',
  },
  customerName: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
export default Sale;
