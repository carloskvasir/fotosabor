export const PROMPTS = {
  ANALYZE_INGREDIENTS: `Analyze this image and identify all visible ingredients.
Return ONLY valid JSON with ingredient names in PORTUGUESE.
Format: {"ingredients":["ingrediente1","ingrediente2"]}
No additional text, just JSON.`,

  GENERATE_BANNER_RECIPE: (ingredients) => `
Create 3 different recipe banners using these ingredients: ${ingredients.join(', ')}

IMPORTANT: Write the recipe names, descriptions and instructions in PORTUGUESE (Brazilian Portuguese).

Return EXACTLY this JSON structure with REAL VALUES (not the word "string"):
{
  "recipes": [
    {
      "name": "actual recipe name 1 in PORTUGUESE",
      "description": "actual description 1 in PORTUGUESE",
      "ingredients": ["${ingredients.join('", "')}"],
      "imageUrl": "actual image url here",
      "estimatedTime": "actual time like '45 minutos'",
      "difficulty": "fácil/médio/difícil",
      "servings": "actual number like '4 porções'"
    },
    {
      "name": "actual recipe name 2 in PORTUGUESE",
      "description": "actual description 2 in PORTUGUESE",
      "ingredients": ["${ingredients.join('", "')}"],
      "imageUrl": "actual image url here",
      "estimatedTime": "actual time like '30 minutos'",
      "difficulty": "fácil/médio/difícil",
      "servings": "actual number like '2 porções'"
    },
    {
      "name": "actual recipe name 3 in PORTUGUESE",
      "description": "actual description 3 in PORTUGUESE",
      "ingredients": ["${ingredients.join('", "')}"],
      "imageUrl": "actual image url here",
      "estimatedTime": "actual time like '60 minutos'",
      "difficulty": "fácil/médio/difícil",
      "servings": "actual number like '6 porções'"
    }
  ]
}

Make each recipe different in cooking style and complexity. Replace ALL placeholder values with real content. No additional text, just JSON.`,

  GENERATE_FULL_RECIPE: (recipeName, ingredients) => `
Create a complete recipe for: ${recipeName}
Using these ingredients: ${ingredients.join(', ')}

IMPORTANT: Write the recipe name, description and instructions in PORTUGUESE (Brazilian Portuguese).

Return EXACTLY this JSON structure with REAL VALUES (not the word "string"):
{
  "receita": {
    "name": "actual recipe name in PORTUGUESE",
    "description": "actual description in PORTUGUESE",
    "imageUrl": "actual image url",
    "estimatedTime": "actual time like '45 minutos'",
    "difficulty": "fácil/médio/difícil",
    "servings": "actual number like '4 porções'",
    "ingredients": [
      {
        "name": "actual ingredient name in PORTUGUESE",
        "quantity": "actual quantity like '2 xícaras'"
      }
    ],
    "instructions": ["step 1 description in PORTUGUESE", "step 2 description in PORTUGUESE"],
    "preparationTime": "actual prep time like '15 minutos'",
    "cookingTime": "actual cook time like '30 minutos'",
    "totalTime": "actual total time like '45 minutos'"
  }
}

Replace ALL placeholder values with real content. No additional text, just JSON.`,
};
