import express from 'express';
import { DataStore } from '../config/store.js';

const router = express.Router();

// GET /api/auth/status - Check if shopkeeper is registered on this device/server
router.get('/status', async (req, res) => {
  try {
    const merchant = await DataStore.getRegisteredMerchant();
    res.json({
      success: true,
      isRegistered: !!merchant,
      registeredShopName: merchant ? merchant.shopName : null,
      registeredOwnerName: merchant ? merchant.fullName : null,
      pilotShopId: merchant ? merchant.pilotShopId : null,
      merchant: merchant || null,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/register - Register Suq Owner with full information
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      password,
      nationalIdOrFayda,
      shopName,
      businessType,
      tinNumber,
      tradeLicenseNo,
      region,
      city,
      subcityOrZone,
      woreda,
      specificLocation,
      telebirrMerchantId,
      telebirrPhone,
      primaryBank,
      bankAccountNumber
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full Name of the shop owner is required' });
    }
    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required (+251 9... / 09...)' });
    }
    if (!shopName || !shopName.trim()) {
      return res.status(400).json({ success: false, message: 'Shop or cafe name is required' });
    }
    if (!password || password.trim().length < 4) {
      return res.status(400).json({ success: false, message: 'Security PIN or password must be at least 4 digits' });
    }

    const merchant = await DataStore.registerMerchant(req.body);

    res.status(201).json({
      success: true,
      message: 'Suq Owner registered successfully!',
      merchant,
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// POST /api/auth/login - Owner login by Name or Phone number & Password
router.post('/login', async (req, res) => {
  try {
    const { identifier, phoneNumber, fullName, name, password } = req.body;
    const loginIdentifier = identifier || fullName || name || phoneNumber;

    if (!loginIdentifier || !String(loginIdentifier).trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner name or phone number is required to sign in' 
      });
    }
    if (!password || !String(password).trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Security PIN or password is required' 
      });
    }

    const merchant = await DataStore.loginMerchant({ 
      identifier: String(loginIdentifier).trim(), 
      password: String(password).trim() 
    });

    res.json({
      success: true,
      message: `Welcome back, ${merchant.fullName}!`,
      merchant,
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(401).json({ success: false, message: error.message });
  }
});

// POST /api/auth/reset-password - Reset owner password after identity verification
router.post('/reset-password', async (req, res) => {
  try {
    const { identifier, phoneNumber, fullName, verificationKey, nationalIdOrFayda, newPassword } = req.body;
    const loginIdentifier = identifier || fullName || phoneNumber;

    if (!loginIdentifier || !String(loginIdentifier).trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner name or phone number is required' 
      });
    }
    if (!newPassword || String(newPassword).trim().length < 4) {
      return res.status(400).json({ 
        success: false, 
        message: 'New security PIN or password must be at least 4 digits' 
      });
    }

    const updatedMerchant = await DataStore.resetMerchantPassword({
      identifier: String(loginIdentifier).trim(),
      verificationKey: verificationKey || nationalIdOrFayda || '',
      newPassword: String(newPassword).trim()
    });

    res.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
      merchant: updatedMerchant
    });
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/profile - Update merchant profile
router.put('/profile', async (req, res) => {
  try {
    const updated = await DataStore.updateMerchantProfile(req.body);
    res.json({
      success: true,
      message: 'Merchant profile updated',
      merchant: updated,
    });
  } catch (error) {
    console.error('Update profile failed:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/auth/reset - Reset all products, sales, and merchant to fresh empty state
router.post('/reset', async (req, res) => {
  try {
    const fresh = await DataStore.resetAllData();
    res.json({
      success: true,
      message: 'SuqSync database successfully reset to clean empty state',
      data: fresh,
    });
  } catch (error) {
    console.error('Reset failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
