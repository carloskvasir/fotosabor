import * as FileSystem from 'expo-file-system';
import appConfig from '../config/appConfig';
import { PROMPTS } from '../config/geminiPrompts';

const GEMINI_API_URL = appConfig.GEMINI_API_URL;
const GEMINI_API_KEY = appConfig.GEMINI_API_KEY;

// Função para chamar a API Gemini - parse direto, sem validação
const callGeminiAPI = async (requestBody) => {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  const responseText = data.candidates[0].content.parts[0].text;

  // Parse direto da resposta JSON
  const jsonMatch = responseText.match(/\{.*\}/s);
  return JSON.parse(jsonMatch[0]);
};

// Analisar imagem para detectar ingredientes
const analyzeImage = async (imageUri) => {
  const base64Image = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const requestBody = {
    contents: [{
      parts: [
        { text: PROMPTS.ANALYZE_INGREDIENTS },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
      ],
    }],
  };

  return await callGeminiAPI(requestBody);
};

// Gerar banner de receita
const generateBannerRecipe = async (ingredients) => {
  const requestBody = {
    contents: [{
      parts: [{ text: PROMPTS.GENERATE_BANNER_RECIPE(ingredients) }],
    }],
  };

  return await callGeminiAPI(requestBody);
};

// Gerar receita completa
const generateFullRecipe = async (recipeName, ingredients) => {
  const requestBody = {
    contents: [{
      parts: [{ text: PROMPTS.GENERATE_FULL_RECIPE(recipeName, ingredients) }],
    }],
  };

  return await callGeminiAPI(requestBody);
};

export {
  analyzeImage,
  generateBannerRecipe,
  generateFullRecipe,
};

