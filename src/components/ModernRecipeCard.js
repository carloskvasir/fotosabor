import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../config/constants';
import { formatIngredients, formatCookingTime } from '../utils/helpers';

const ModernRecipeCard = ({
  item,
  onPress,
  showIngredients = true,
  showFavoriteIcon = false,
  isLoading = false,
  cardStyle = 'default', // 'default' | 'compact'
}) => {
  // Suporte a ambos os formatos de dados
  const name = item.name || item.title || 'Receita sem nome';
  const description = item.description || 'Sem descrição';
  const ingredients = formatIngredients(item.ingredients || item.ingredientes || []);
  const estimatedTime = item.estimatedTime || item.preparationTime || null;
  const difficulty = item.difficulty || null;
  const servings = item.servings || null;

  const renderIngredients = () => {
    if (!showIngredients || ingredients.length === 0) return null;

    return (
      <View style={styles.ingredientsPreview}>
        <Text style={styles.ingredientsLabel}>Ingredientes:</Text>
        <View style={styles.ingredientsTags}>
          {ingredients.slice(0, 3).map((ingredient, idx) => (
            <View key={idx} style={styles.ingredientTag}>
              <Text style={styles.ingredientTagText}>
                {ingredient}
              </Text>
            </View>
          ))}
          {ingredients.length > 3 && (
            <Text style={styles.moreIngredients}>
                            +{ingredients.length - 3}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderInfoTags = () => {
    const infos = [];
    if (estimatedTime) {
      const timeText = typeof estimatedTime === 'number'
        ? formatCookingTime(estimatedTime)
        : estimatedTime;
      infos.push({ icon: 'clock', text: timeText, color: '#3498db' });
    }
    if (servings) infos.push({ icon: 'users', text: servings, color: '#e67e22' });
    if (difficulty) infos.push({ icon: 'trending-up', text: difficulty, color: '#9b59b6' });

    if (infos.length === 0) return null;

    return (
      <View style={styles.infoTags}>
        {infos.map((info, idx) => (
          <View key={idx} style={styles.infoTag}>
            <Icon name={info.icon} type="feather" size={12} color={info.color} />
            <Text style={[styles.infoTagText, { color: info.color }]}>{info.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.recipeCard,
        cardStyle === 'compact' && styles.compactCard,
      ]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[
            styles.cardIcon,
            showFavoriteIcon && styles.favoriteIcon,
          ]}>
            <Icon
              name={showFavoriteIcon ? 'heart' : 'book-open'}
              type="feather"
              size={20}
              color={showFavoriteIcon ? '#e74c3c' : '#2089dc'}
            />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.recipeTitle} numberOfLines={cardStyle === 'compact' ? 1 : 2}>
              {name}
            </Text>
            <Text style={styles.recipeDescription} numberOfLines={cardStyle === 'compact' ? 1 : 2}>
              {description}
            </Text>
            {renderInfoTags()}
          </View>
          <View style={styles.cardAction}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#2089dc" />
            ) : (
              <Icon
                name="chevron-right"
                type="feather"
                size={20}
                color="#666"
              />
            )}
          </View>
        </View>

        {renderIngredients()}
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Preparando receita...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    position: 'relative',
  },
  compactCard: {
    padding: 14,
    marginVertical: 4,
    marginHorizontal: 0,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteIcon: {
    backgroundColor: '#ffeaea',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  infoTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  infoTagText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  ingredientsPreview: {
    marginTop: 8,
  },
  ingredientsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  ingredientTag: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  ingredientTagText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '500',
  },
  moreIngredients: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#2089dc',
    fontWeight: '500',
    marginTop: 8,
  },
});

export default ModernRecipeCard;
