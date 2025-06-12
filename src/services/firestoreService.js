import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Função para adicionar receita aos favoritos
export const addToFavorites = async (userId, recipe) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipe.id}`);
    await setDoc(favoriteRef, {
      userId,
      recipeId: recipe.id,
      name: recipe.name,
      description: recipe.description,
      imageUrl: recipe.imageUrl,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error);
    return false;
  }
};

// Função para remover receita dos favoritos
export const removeFromFavorites = async (userId, recipeId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
    return false;
  }
};

// Função para buscar favoritos do usuário
export const getUserFavorites = async (userId) => {
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
    );
    const querySnapshot = await getDocs(favoritesQuery);
    const favorites = [];

    querySnapshot.forEach((doc) => {
      favorites.push({
        id: doc.data().recipeId,
        ...doc.data(),
      });
    });

    return favorites;
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }
};

// Função para verificar se uma receita está nos favoritos
export const isFavorite = async (userId, recipeId) => {
  try {
    const favoriteRef = doc(db, 'favorites', `${userId}_${recipeId}`);
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    return false;
  }
};

// Salvar receita completa na coleção full_recipe
export const saveFullRecipe = async (recipe) => {
  try {
    const recipeRef = doc(db, 'full_recipe', recipe.id);
    await setDoc(recipeRef, recipe);
    return true;
  } catch (error) {
    console.error('Erro ao salvar receita completa:', error);
    return false;
  }
};

// Salvar banner na coleção banner_recipe
export const saveBannerRecipe = async (banner) => {
  try {
    const bannerRef = doc(db, 'banner_recipe', banner.id);
    await setDoc(bannerRef, banner);
    return true;
  } catch (error) {
    console.error('Erro ao salvar banner da receita:', error);
    return false;
  }
};

// Buscar receita completa por ID
export const getFullRecipe = async (recipeId) => {
  try {
    const recipeRef = doc(db, 'full_recipe', recipeId);
    const docSnap = await getDoc(recipeRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      console.log('Receita completa não encontrada:', recipeId);
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar receita completa:', error);
    return null;
  }
};

// Buscar receitas de banner para exibir na home
export const getBannerRecipes = async (limit = 20) => {
  try {
    const bannerQuery = collection(db, 'banner_recipe');
    const querySnapshot = await getDocs(bannerQuery);
    const banners = [];

    querySnapshot.forEach((doc) => {
      banners.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Limitar o número de resultados
    return banners.slice(0, limit);
  } catch (error) {
    console.error('Erro ao buscar receitas de banner:', error);
    return [];
  }
};

// Buscar todas as receitas públicas
export const getPublicRecipes = async (limit = 20) => {
  try {
    const recipesQuery = collection(db, 'full_recipe');
    const querySnapshot = await getDocs(recipesQuery);
    const recipes = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        title: data.name || data.title,
        name: data.name || data.title,
        description: data.description,
        imageUrl: data.imageUrl || data.image,
        image: data.imageUrl || data.image,
        ...data,
      });
    });

    // Limitar o número de resultados e ordenar por data de criação (se disponível)
    return recipes
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Mais recentes primeiro
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Erro ao buscar receitas públicas:', error);
    return [];
  }
};
