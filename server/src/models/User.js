import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Owner full name is required'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Owner phone number is required (+251 9...)'],
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Security PIN or password is required'],
  },
  nationalIdOrFayda: {
    type: String,
    trim: true,
    default: '',
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
  },
  businessType: {
    type: String,
    enum: [
      'Retail Kiosk (Suq)',
      'Mini-Mart',
      'Cafe / Buna',
      'Spices & Grains',
      'General Merchandise',
      'Pharmacy / Cosmetics',
      'Other'
    ],
    default: 'Retail Kiosk (Suq)',
  },
  tinNumber: {
    type: String,
    trim: true,
    default: '',
  },
  tradeLicenseNo: {
    type: String,
    trim: true,
    default: '',
  },
  region: {
    type: String,
    default: 'Addis Ababa',
    trim: true,
  },
  city: {
    type: String,
    default: 'Addis Ababa',
    trim: true,
  },
  subcityOrZone: {
    type: String,
    default: 'Bole Subcity',
    trim: true,
  },
  woreda: {
    type: String,
    default: 'Woreda 03',
    trim: true,
  },
  specificLocation: {
    type: String,
    default: '',
    trim: true,
  },
  telebirrMerchantId: {
    type: String,
    trim: true,
    default: '',
  },
  telebirrPhone: {
    type: String,
    trim: true,
    default: '',
  },
  primaryBank: {
    type: String,
    enum: ['CBE', 'Coop Bank', 'Awash Bank', 'Sinqee Bank', 'Abyssinia Bank', 'Other'],
    default: 'CBE',
  },
  bankAccountNumber: {
    type: String,
    trim: true,
    default: '',
  },
  pilotShopId: {
    type: String,
    default: 'SUQ-ETH-001',
  },
  isRegistered: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
