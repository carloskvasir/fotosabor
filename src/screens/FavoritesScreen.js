import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { auth } from '../config/firebaseConfig';
import BottomNavigation from '../components/BottomNavigation';
import ModernRecipeCard from '../components/ModernRecipeCard';
import { getFullRecipe, getUserFavorites } from '../services/firestoreService';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const user = auth.currentUser;

  const loadFavorites = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const userFavorites = await getUserFavorites(user.uid);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  // Recarregar favoritos sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const filteredFavorites = favorites.filter(item =>
    item.name && item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleFavoritePress = async (favoriteItem) => {
    console.log('🔍 Debug - Favorito clicado:', favoriteItem);
    console.log('🔍 Debug - ID do favorito:', favoriteItem.recipeId || favoriteItem.id);

    try {
      // Buscar receita completa da coleção full_recipe
      const fullRecipe = await getFullRecipe(favoriteItem.recipeId || favoriteItem.id);
      console.log('🔍 Debug - Receita completa encontrada:', !!fullRecipe);

      if (fullRecipe) {
        console.log('🔍 Debug - Dados da receita completa:', fullRecipe);
        // Navegar com a receita completa
        navigation.navigate('RecipeDetail', {
          recipe: fullRecipe,
          originalImage: null, // Favoritos não têm imagem original
          detectedIngredients: [], // Favoritos não têm ingredientes detectados
        });
      } else {
        console.log('⚠️ Receita completa não encontrada, usando dados do favorito');
        // Fallback: usar dados básicos do favorito
        Alert.alert(
          'Receita não encontrada',
          'A receita completa não foi encontrada no banco. Exibindo dados básicos.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('RecipeDetail', {
                recipe: favoriteItem,
                originalImage: null,
                detectedIngredients: [],
              }),
            },
          ],
        );
      }
    } catch (error) {
      console.error('❌ Erro ao buscar receita completa:', error);
      Alert.alert('Erro', 'Não foi possível carregar a receita completa.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6fa8dc" />
        <Text style={styles.loadingText}>Carregando favoritos...</Text>
        <BottomNavigation />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar nos favoritos..."
        value={searchText}
        onChangeText={setSearchText}
        platform="default"
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />

      {favorites.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Nenhuma receita favorita ainda</Text>
          <Text style={styles.emptySubText}>
                        Comece adicionando receitas aos seus favoritos!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ModernRecipeCard
              item={item}
              showFavoriteIcon={true}
              showIngredients={false}
              cardStyle="compact"
              onPress={() => handleFavoritePress(item)}
            />
          )}
        />
      )}

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6fa8dc',
  },
  searchContainer: {
    backgroundColor: '#6fa8dc',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    paddingTop: 10,
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  list: {
    paddingBottom: 80,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  separator: {
    height: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
});
