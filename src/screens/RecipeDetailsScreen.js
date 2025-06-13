import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, Text } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';
import { auth } from '../config/firebaseConfig';
import { COLORS } from '../config/constants';
import { addToFavorites, isFavorite, removeFromFavorites, saveBannerRecipe, saveFullRecipe } from '../services/firestoreService';
import { formatCookingTime, generateRecipeId } from '../utils/helpers';

export default function RecipeDetailsScreen({ route, navigation }) {
  const { recipe, originalImage, detectedIngredients } = route.params;
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;

  console.log('🍳 RecipeDetailsScreen - Receita recebida:', recipe);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const checkIfFavorite = useCallback(async () => {
    if (user && recipe?.id) {
      const favoriteStatus = await isFavorite(user.uid, recipe.id);
      setIsFav(favoriteStatus);
    }
  }, [user, recipe?.id]);

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para favoritar receitas');
      return;
    }

    const recipeToSave = { ...recipe };

    // Garantir que a receita tenha um ID único e consistente
    if (!recipeToSave.id) {
      recipeToSave.id = generateRecipeId(recipeToSave.name);
    }

    console.log('🔍 Debug - ID da receita:', recipeToSave.id);
    console.log('🔍 Debug - Nome da receita:', recipeToSave.name);
    console.log('🔍 Debug - Receita completa:', JSON.stringify(recipeToSave, null, 2));

    setLoading(true);
    try {
      if (isFav) {
        const success = await removeFromFavorites(user.uid, recipeToSave.id);
        if (success) {
          setIsFav(false);
          Alert.alert('Sucesso', 'Receita removida dos favoritos!');
        } else {
          Alert.alert('Erro', 'Não foi possível remover dos favoritos');
        }
      } else {
        // Primeiro salva a receita completa
        console.log('💾 Salvando receita completa...');
        const fullRecipeSaved = await saveFullRecipe(recipeToSave);
        console.log('💾 Receita completa salva:', fullRecipeSaved);

        // Depois adiciona aos favoritos
        console.log('⭐ Adicionando aos favoritos...');
        const success = await addToFavorites(user.uid, recipeToSave);
        console.log('⭐ Favorito adicionado:', success);

        // E salva o banner
        const banner = {
          id: recipeToSave.id,
          name: recipeToSave.name,
          description: recipeToSave.description,
          imageUrl: recipeToSave.imageUrl,
          estimatedTime: recipeToSave.estimatedTime || recipeToSave.preparationTime,
          difficulty: recipeToSave.difficulty,
          servings: recipeToSave.servings,
        };
        console.log('🏷️ Salvando banner...');
        const bannerSaved = await saveBannerRecipe(banner);
        console.log('🏷️ Banner salvo:', bannerSaved);

        if (success) {
          setIsFav(true);
          Alert.alert('Sucesso', `Receita "${recipeToSave.name}" adicionada aos favoritos!`);
        } else {
          Alert.alert('Erro', 'Não foi possível adicionar aos favoritos');
        }
      }
    } catch (error) {
      console.error('Erro ao favoritar receita:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-left" type="feather" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receita Completa</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
          disabled={loading}
        >
          <Icon
            name="heart"
            type="feather"
            color={isFav ? '#e74c3c' : '#666'}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        {originalImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: originalImage }} style={styles.recipeImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageLabel}>Foto Original</Text>
            </View>
          </View>
        )}

        {/* Recipe Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeTitle}>{recipe?.name || 'Receita sem nome'}</Text>
          {recipe?.description && (
            <Text style={styles.recipeDescription}>{recipe.description}</Text>
          )}
        </View>

        {/* Botão de like grande */}
        <View style={styles.largeLikeContainer}>
          <TouchableOpacity
            style={[
              styles.largeLikeButton,
              { backgroundColor: isFav ? '#ffeaea' : '#f0f0f0' },
            ]}
            onPress={toggleFavorite}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Icon
              name="heart"
              type="feather"
              color={isFav ? '#e74c3c' : '#bbb'}
              size={48}
            />
          </TouchableOpacity>
        </View>
        {/* Fim botão de like grande */}

        {/* Detected Ingredients */}
        {detectedIngredients && detectedIngredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes Detectados</Text>
            <View style={styles.detectedIngredients}>
              {detectedIngredients.map((ingredient, index) => (
                <View key={index} style={styles.detectedChip}>
                  <Text style={styles.detectedText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recipe Ingredients */}
        {recipe?.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Icon name="check-circle" type="feather" size={16} color="#27ae60" />
                  <Text style={styles.ingredientText}>
                    {typeof ingredient === 'object' ?
                      `${ingredient.quantity} de ${ingredient.name}` :
                      ingredient
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recipe Instructions */}
        {recipe?.instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
            <View style={styles.instructionsContainer}>
              {Array.isArray(recipe.instructions) ? (
                recipe.instructions.map((step, index) => (
                  <View key={index} style={styles.instructionStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.instructionsText}>{recipe.instructions}</Text>
              )}
            </View>
          </View>
        )}

        {/* Recipe Info */}
        {(recipe?.preparationTime || recipe?.servings || recipe?.difficulty) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.infoContainer}>
              {recipe.preparationTime && (
                <View style={styles.infoItem}>
                  <Icon name="clock" type="feather" size={20} color="#3498db" />
                  <Text style={styles.infoText}>
                    {typeof recipe.preparationTime === 'number'
                      ? formatCookingTime(recipe.preparationTime)
                      : recipe.preparationTime}
                  </Text>
                </View>
              )}
              {recipe.servings && (
                <View style={styles.infoItem}>
                  <Icon name="users" type="feather" size={20} color="#e67e22" />
                  <Text style={styles.infoText}>{recipe.servings}</Text>
                </View>
              )}
              {recipe.difficulty && (
                <View style={styles.infoItem}>
                  <Icon name="trending-up" type="feather" size={20} color="#9b59b6" />
                  <Text style={styles.infoText}>{recipe.difficulty}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  favoriteButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  titleSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detectedIngredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detectedChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 3,
  },
  detectedText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2089dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 100,
  },
  largeLikeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  largeLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
