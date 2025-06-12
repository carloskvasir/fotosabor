import { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';
import ModernRecipeCard from '../components/ModernRecipeCard';
import { generateFullRecipe } from '../services/geminiService';

export default function RecipeResultsScreen({ route, navigation }) {
  const { recipes, ingredients, originalImage } = route.params || {};
  const [loadingRecipe, setLoadingRecipe] = useState(null);

  // Debug: Log das receitas recebidas
  console.log('📱 RecipeResultsScreen - Receitas recebidas:', recipes?.length || 0);
  console.log('📱 Dados das receitas:', JSON.stringify(recipes, null, 2));

  const goBackToCamera = () => {
    navigation.goBack();
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const handleRecipePress = async (recipeCard) => {
    console.log('🍳 Card pressionado:', recipeCard.name);
    setLoadingRecipe(recipeCard.name);

    try {
      // Gerar receita completa usando a API Gemini
      const fullRecipeData = await generateFullRecipe(recipeCard.name, recipeCard.ingredients);

      if (fullRecipeData && fullRecipeData.receita) {
        console.log('✅ Receita completa gerada:', fullRecipeData.receita.name);

        // Navegar para tela de detalhes com a receita completa
        navigation.navigate('RecipeDetail', {
          recipe: fullRecipeData.receita,
          originalImage: originalImage,
          detectedIngredients: ingredients,
        });
      } else {
        console.error('❌ Erro: Dados de receita inválidos');
        // TODO: Mostrar erro para o usuário
      }
    } catch (error) {
      console.error('❌ Erro ao gerar receita completa:', error);
      // TODO: Mostrar erro para o usuário
    } finally {
      setLoadingRecipe(null);
    }
  };

  const renderRecipeCard = ({ item, index }) => {
    // Suporte a ambos os formatos de campo (nome/name, descrição/description)
    const name = item.name || item.nome || 'Receita sem nome';
    const description = item.description || item.descricao || 'Sem descrição';
    const ingredients = item.ingredients || item.ingredientes || [];

    console.log(`🃏 Renderizando card ${index}: ${name}`);
    const isLoading = loadingRecipe === name;

    return (
      <ModernRecipeCard
        item={{ ...item, name, description, ingredients }}
        onPress={() => handleRecipePress({ ...item, name, description, ingredients })}
        showIngredients={true}
        showFavoriteIcon={false}
        isLoading={isLoading}
        cardStyle="default"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToCamera}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" type="feather" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receitas Sugeridas</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={goToHome}
          activeOpacity={0.7}
        >
          <Icon name="home" type="feather" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Original Image and Ingredients */}
      {originalImage && (
        <View style={styles.originalImageSection}>
          <Image source={{ uri: originalImage }} style={styles.originalImage} />
          <View style={styles.detectedIngredientsSection}>
            <Text style={styles.detectedTitle}>Ingredientes Detectados:</Text>
            <View style={styles.detectedIngredients}>
              {ingredients?.map((ingredient, index) => (
                <View key={index} style={styles.detectedChip}>
                  <Text style={styles.detectedText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Recipes List */}
      <View style={styles.recipesContainer}>
        <View style={styles.recipesHeader}>
          <Icon name="bookmark" type="feather" size={24} color="#2089dc" />
          <Text style={styles.recipesTitle}>
            {recipes?.length || 0} receita(s) encontrada(s)
          </Text>
        </View>

        {recipes && recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={renderRecipeCard}
            keyExtractor={(item, index) => `recipe-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recipesList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.noRecipesContainer}>
            <Icon name="search" type="feather" size={48} color="#ccc" />
            <Text style={styles.noRecipesText}>Nenhuma receita encontrada</Text>
            <Text style={styles.noRecipesSubText}>
                            Tente com outros ingredientes
            </Text>
          </View>
        )}
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  originalImageSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  originalImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  detectedIngredientsSection: {
    marginTop: 8,
  },
  detectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detectedIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detectedChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
  },
  detectedText: {
    fontSize: 12,
    color: '#1976d2',
  },
  recipesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  recipesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  recipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  recipesList: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  noRecipesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noRecipesText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  noRecipesSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
