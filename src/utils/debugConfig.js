/**
 * Global Debug Configuration
 * Set DEBUG_MODE = false to disable all console logs
 */

export const DEBUG_MODE = false; // Set to true for development, false for production

// Safe console log that respects DEBUG_MODE
export const debugLog = (tag, message, data = null) => {
  if (!DEBUG_MODE) return;
  
  if (data) {
    console.log(`[${tag}] ${message}`, data);
  } else {
    console.log(`[${tag}] ${message}`);
  }
};

// Error logging (always visible)
export const errorLog = (tag, message, error = null) => {
  if (error) {
    console.error(`[${tag}] ${message}`, error);
  } else {
    console.error(`[${tag}] ${message}`);
  }
};
