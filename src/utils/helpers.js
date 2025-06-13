// Utility functions for the FotoSabor app
import { Platform } from 'react-native';

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Formats a timestamp to a readable date string
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

/**
 * Generates a unique ID for recipes
 * @param {string} name - Recipe name
 * @returns {string} Unique ID
 */
export const generateRecipeId = (name) => {
  const timestamp = Date.now();
  const cleanName = name?.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 30); // Limit to 30 characters
  return `${cleanName}-${timestamp}`;
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'A senha deve ter pelo menos 6 caracteres',
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: 'A senha não pode ter mais de 128 caracteres',
    };
  }

  return {
    isValid: true,
    message: 'Senha válida',
  };
};

/**
 * Formats cooking time from minutes to readable string
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatCookingTime = (minutes) => {
  if (!minutes || isNaN(minutes)) return 'Tempo não informado';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Sanitizes input text to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Checks if the app is running on a mobile device
 * @returns {boolean} True if running on mobile
 */
export const isMobile = () => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

/**
 * Formats ingredient list for display
 * @param {Array} ingredients - Array of ingredients
 * @returns {Array} Formatted ingredients
 */
export const formatIngredients = (ingredients) => {
  if (!Array.isArray(ingredients)) return [];

  return ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      return ingredient.trim();
    }

    if (typeof ingredient === 'object' && ingredient.name) {
      const quantity = ingredient.quantity || ingredient.quantidade || '';
      const name = ingredient.name || ingredient.nome || '';
      return quantity ? `${quantity} de ${name}` : name;
    }

    return 'Ingrediente inválido';
  }).filter(Boolean);
};

/**
 * Gets platform-specific styles
 * @param {object} styles - Style object with platform keys
 * @returns {object} Platform-specific styles
 */
export const getPlatformStyles = (styles) => {
  const platformKey = Platform.OS;
  return {
    ...styles.default,
    ...styles[platformKey],
  };
};
