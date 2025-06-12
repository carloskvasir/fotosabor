// Application constants and configuration

export const APP_CONFIG = {
  // Recipe generation settings
  MAX_RECIPES_PER_REQUEST: 3,
  MAX_INGREDIENTS_PER_ANALYSIS: 10,
  MIN_INGREDIENT_NAME_LENGTH: 2,
  MAX_INGREDIENT_NAME_LENGTH: 50,

  // Image processing settings
  IMAGE_QUALITY: 0.8,
  IMAGE_ASPECT_RATIO: [4, 3],

  // API retry settings
  MAX_API_RETRIES: 2,
  RETRY_DELAY_MS: 1000,

  // UI animations
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },

  // Recipe difficulty levels
  DIFFICULTY_LEVELS: ['fácil', 'médio', 'difícil'],

  // Default recipe categories
  RECIPE_CATEGORIES: [
    'Entrada',
    'Prato Principal',
    'Sobremesa',
    'Bebida',
    'Lanche',
    'Salada',
    'Sopa',
    'Molho',
  ],

  // Common cooking units
  COOKING_UNITS: [
    'xícara',
    'colher de sopa',
    'colher de chá',
    'litro',
    'ml',
    'kg',
    'g',
    'pitada',
    'a gosto',
    'unidade',
  ],

  // Error messages
  ERROR_MESSAGES: {
    NO_CAMERA_PERMISSION: 'Precisamos de permissão para acessar sua câmera',
    CAMERA_ACCESS_FAILED: 'Não foi possível acessar a câmera',
    GALLERY_ACCESS_FAILED: 'Não foi possível acessar suas fotos',
    IMAGE_LOAD_FAILED: 'Não foi possível carregar a imagem',
    GEMINI_CONNECTION_FAILED: 'Não foi possível conectar-se à API do Gemini.\nVerifique sua conexão e a chave de API.',
    INVALID_JSON_RESPONSE: 'Erro ao interpretar a resposta do Gemini',
    NO_INGREDIENTS_FOUND: 'Nenhum ingrediente identificado',
    NO_RECIPES_GENERATED: 'Nenhuma receita identificada',
    ALL_INGREDIENTS_REMOVED: 'Você removeu todos os ingredientes. Pelo menos um ingrediente é necessário para prosseguir.',
    INGREDIENT_ALREADY_EXISTS: 'Este ingrediente já foi adicionado.',
    INGREDIENT_TOO_SHORT: 'O ingrediente deve ter pelo menos 2 caracteres.',
    INGREDIENT_REQUIRED: 'Digite um ingrediente válido.',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    IMAGE_LOADED: 'Imagem carregada com sucesso',
    TEST_IMAGE_LOADED: 'Imagem de teste carregada para simulação.',
    ANALYSIS_COMPLETED: 'Análise Concluída!',
    RECIPES_GENERATED: 'Receitas geradas com sucesso!',
  },
};

// Recipe validation rules
export const VALIDATION_RULES = {
  recipe: {
    nome: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    ingredientes: {
      required: true,
      minItems: 1,
      maxItems: 20,
    },
    instrucoes: {
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    tempoPreparo: {
      min: 1,
      max: 480, // 8 hours max
    },
  },
  ingredient: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s]+$/, // Only letters and spaces
    },
  },
};

// Color scheme
export const COLORS = {
  primary: '#2089dc',
  secondary: '#e1f5fe',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#c0392b',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: {
    primary: '#333',
    secondary: '#666',
    disabled: '#999',
    inverse: '#ffffff',
  },
  border: '#e1e4e8',
  disabled: '#ccc',
};

// Screen names for navigation
export const SCREENS = {
  HOME: 'Home',
  CAMERA: 'Camera',
  RECIPE_RESULTS: 'RecipeResults',
  RECIPE_DETAILS: 'RecipeDetails',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
};
