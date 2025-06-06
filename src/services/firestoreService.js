import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// Função para adicionar receita aos favoritos
export const addToFavorites = async (userId, recipe) => {
    try {
        const favoriteRef = doc(db, 'favorites', `${userId}_${recipe.id}`);
        await setDoc(favoriteRef, {
            userId,
            recipeId: recipe.id,
            title: recipe.title,
            description: recipe.description,
            image: recipe.image,
            createdAt: new Date().toISOString()
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
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        const favorites = [];
        
        querySnapshot.forEach((doc) => {
            favorites.push({
                id: doc.data().recipeId,
                ...doc.data()
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
