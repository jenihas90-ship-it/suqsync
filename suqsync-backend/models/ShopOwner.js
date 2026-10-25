import mongoose from 'mongoose';

const shopOwnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Owner full name is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  passwordHash: {
    type: String,
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
  },
  pilotShopId: {
    type: String,
    default: 'SUQ-ETH-001',
    trim: true,
  },
  isRegistered: {
    type: Boolean,
    default: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'owner',
  },
}, {
  timestamps: true,
});

export const ShopOwner = mongoose.models.ShopOwner || mongoose.model('ShopOwner', shopOwnerSchema);
export default ShopOwner;
