const axios = require('axios');
require('dotenv').config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

exports.searchImage = async (req, res) => {
  let query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });
  // Refine query for food relevance
  query = `${query} food`;

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 10,
        orientation: 'squarish',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    const results = response.data.results;
    if (results.length === 0) {
      return res.status(404).json({ error: 'No image found' });
    }
    // Pick a random image from the results
    const image = results[Math.floor(Math.random() * results.length)];
    return res.json({
      imageUrl: image.urls.small,
      fullImageUrl: image.urls.full,
      photographer: image.user.name,
      photographerProfile: image.user.links.html,
      unsplashLink: image.links.html,
      downloadLink: image.links.download_location,
      attribution: `Photo by ${image.user.name} on Unsplash`,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch image', details: err.message });
  }
};
