import * as FileSystem from 'expo-file-system';
import appConfig from '../../config/appConfig';

const GEMINI_API_URL = appConfig.GEMINI_API_URL;
const GEMINI_API_KEY = appConfig.GEMINI_API_KEY;

const analyzeImage = async (imageUri, prompt) => {

    try {
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        },
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: base64Image,
                            },
                        },
                    ],
                },
            ],
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na API do Gemini:', errorData);
            throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Erro ao enviar para o Gemini:', error);
        throw error;
    }
};

//todo mudar o prompt para o receitas
const generateRecipes = async (ingredients) => {

    const prompt = `Com base nos seguintes ingredientes: ${ingredients.join(', ')}. Por favor, forneça 3 sugestões de receitas simples e práticas que utilizem esses ingredientes. Para cada receita, inclua:
        1. Nome da Receita
        2. Ingredientes necessários (da lista fornecida e outros comuns, se aplicável)
        3. Instruções de preparo concisas.
        Retorne a resposta em formato JSON. O JSON deve ter uma chave principal 'receitas' que contém um array de objetos. Cada objeto de receita deve ter as chaves 'nome', 'ingredientes' (array de strings) e 'instrucoes' (string).`;
    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ],
                },
            ],
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na API do Gemini:', errorData);
            throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('Erro ao enviar para o Gemini:', error);
        throw error;
    }
};

export { analyzeImage, generateRecipes };