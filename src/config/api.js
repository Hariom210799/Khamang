/**
 * Centralized API Configuration
 * This file manages all API endpoints for the app
 * 
 * For development: Uses local backend
 * For production: Uses deployed backend server
 */

// ⚠️ CHANGE THIS TO YOUR PRODUCTION SERVER URL
// Example: 'https://api.khamang.com' or 'https://khamang-backend.herokuapp.com'
const PRODUCTION_API_URL = 'https://your-production-server.com'; // TODO: Update with your live server

// Development server (for emulator/local testing)
const DEVELOPMENT_API_URL = 'http://10.0.2.2:3000';

/**
 * Determine which environment we're in
 * In production build, __DEV__ will be false
 */
const API_BASE_URL = __DEV__ ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,

  // Authentication endpoints
  LOGIN: `${API_BASE_URL}/api/v1/users/login`,
  SIGNUP: `${API_BASE_URL}/api/v1/users/signup`,
  GET_USER: (userId) => `${API_BASE_URL}/api/v1/users/${userId}`,

  // Maker endpoints
  GET_MAKER: (userId) => `${API_BASE_URL}/api/v1/makers/${userId}`,
  GET_MAKERS: `${API_BASE_URL}/api/v1/makers`,
  UPDATE_MAKER_STATUS: (userId) => `${API_BASE_URL}/api/v1/makers/${userId}/shop-status`,
  UPDATE_MAKER_TIME: (userId) => `${API_BASE_URL}/api/v1/makers/${userId}`,

  // Menu endpoints
  GET_MENU: (menuId) => `${API_BASE_URL}/api/v1/menus/${menuId}`,
  GET_MAKER_MENU: (makerId) => `${API_BASE_URL}/api/v1/menus/${makerId}`,
  GET_CATEGORIES: (makerId) => `${API_BASE_URL}/api/v1/menus/${makerId}/categories`,

  // Dish endpoints
  GET_DISH: (dishId) => `${API_BASE_URL}/api/v1/dishes/${dishId}`,
  CREATE_DISH: `${API_BASE_URL}/api/v1/dishes`,
  UPDATE_DISH: (dishId) => `${API_BASE_URL}/api/v1/dishes/${dishId}`,
  DELETE_DISH: (dishId) => `${API_BASE_URL}/api/v1/dishes/${dishId}`,

  // Order endpoints
  GET_ORDERS: `${API_BASE_URL}/api/v1/orders`,
  GET_ORDER: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}`,
  CREATE_ORDER: `${API_BASE_URL}/api/v1/orders`,
  UPDATE_ORDER: (orderId) => `${API_BASE_URL}/api/v1/orders/${orderId}`,

  // Cloudinary endpoints
  GET_CLOUDINARY_SIGNATURE: `${API_BASE_URL}/api/v1/cloudinary/signature`,

  // Image search endpoint
  SEARCH_IMAGES: `${API_BASE_URL}/api/v1/images/search`,
};

/**
 * Helper function to log which environment is being used
 * Remove in production
 */
if (__DEV__) {
  console.log('🔧 DEV MODE - Using:', API_BASE_URL);
} else {
  console.log('🚀 PRODUCTION MODE - Using:', API_BASE_URL);
}

export default API_CONFIG;
