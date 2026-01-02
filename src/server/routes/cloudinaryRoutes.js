const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Generate Cloudinary upload signature
router.post('/signature', (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    
    // ✅ Create params in alphabetical order (CRITICAL for Cloudinary)
    const params = {
      folder: 'khamang_dishes',
      timestamp: timestamp,
    };

    // ✅ Sort alphabetically and create query string
    const paramsString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // ✅ Hash: params + api_secret
    const toSign = paramsString + process.env.CLOUDINARY_API_SECRET;
    const signature = crypto
      .createHash('sha1')
      .update(toSign)
      .digest('hex');

    console.log('✅ Signature generated');
    console.log('📝 Params:', params);
    console.log('📝 Params String:', paramsString);
    console.log('📝 To Sign:', toSign);
    console.log('📝 Signature:', signature);
    console.log('📝 Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('📝 API Key:', process.env.CLOUDINARY_API_KEY);

    res.status(200).json({
      status: 'success',
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.log('❌ Signature error:', error.message);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
