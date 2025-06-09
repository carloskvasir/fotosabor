import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';
import ModernRecipeCard from '../components/ModernRecipeCard';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { getPublicRecipes } from '../services/firestoreService';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useFirebaseAuth();
    
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    // Carregar receitas do Firebase
    const loadRecipes = useCallback(async () => {
        try {
            setIsLoading(true);
            const publicRecipes = await getPublicRecipes(50); // Carregar até 50 receitas
            console.log('Receitas carregadas:', publicRecipes.length);
            setRecipes(publicRecipes);
            setFilteredRecipes(publicRecipes);
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carregar receitas ao montar o componente
    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    // Filtrar receitas baseado na busca
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredRecipes(recipes);
        } else {
            const filtered = recipes.filter(recipe => {
                const name = recipe.name || recipe.title || '';
                const description = recipe.description || '';
                const searchLower = searchText.toLowerCase();
                
                return name.toLowerCase().includes(searchLower) ||
                       description.toLowerCase().includes(searchLower);
            });
            setFilteredRecipes(filtered);
        }
    }, [searchText, recipes]);

    const handleRecipePress = (recipe) => {
        navigation.navigate('RecipeDetail', { recipe });
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                {isLoading ? 'Carregando receitas...' : 'Nenhuma receita encontrada'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Buscar receitas..."
                platform="default"
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
                value={searchText}
                onChangeText={setSearchText}
                showLoading={isLoading}
            />

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2089dc" />
                    <Text style={styles.loadingText}>Carregando receitas...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[
                        styles.list,
                        filteredRecipes.length === 0 && styles.emptyList
                    ]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <ModernRecipeCard
                            item={item}
                            onPress={() => handleRecipePress(item)}
                            showIngredients={false}
                            showFavoriteIcon={false}
                            cardStyle="compact"
                        />
                    )}
                    ListEmptyComponent={renderEmptyComponent}
                    refreshing={isLoading}
                    onRefresh={loadRecipes}
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
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.8,
    },
});
