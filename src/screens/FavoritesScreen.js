import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { auth } from '../../firebaseConfig';
import BottomNavigation from '../components/BottomNavigation';
import RecipeCard from '../components/RecipeCard';
import { getUserFavorites } from '../services/firestoreService';

export default function FavoritesScreen() {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const user = auth.currentUser;

    const loadFavorites = async () => {
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
    };

    // Recarregar favoritos sempre que a tela ganhar foco
    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [user])
    );

    const filteredFavorites = favorites.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );

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
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <RecipeCard
                            item={item}
                            showHeart={true}
                            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
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
