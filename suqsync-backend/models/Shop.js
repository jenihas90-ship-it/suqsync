import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  shopId: {
    type: String,
    trim: true,
  },
  pilotShopId: {
    type: String,
    trim: true,
    default: 'SUQ-ETH-001',
  },
  shopName: {
    type: String,
    trim: true,
    default: 'SuqSync Shop',
  },
  ownerName: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);
export default Shop;
