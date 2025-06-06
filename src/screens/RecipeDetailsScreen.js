import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import { auth } from '../../firebaseConfig';
import BottomNavigation from '../components/BottomNavigation';
import { addToFavorites, isFavorite, removeFromFavorites } from '../services/firestoreService';

export default function RecipeDetailScreen({ route }) {
    const { recipe } = route.params;
    const [isFav, setIsFav] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        checkIfFavorite();
    }, []);

    const checkIfFavorite = async () => {
        if (user && recipe.id) {
            const favoriteStatus = await isFavorite(user.uid, recipe.id);
            setIsFav(favoriteStatus);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para favoritar receitas');
            return;
        }

        if (!recipe.id) {
            // Se a receita não tem ID, criar um baseado no título
            recipe.id = recipe.title.toLowerCase().replace(/\s+/g, '-');
        }

        setLoading(true);
        try {
            if (isFav) {
                const success = await removeFromFavorites(user.uid, recipe.id);
                if (success) {
                    setIsFav(false);
                    Alert.alert('Sucesso', 'Receita removida dos favoritos!');
                } else {
                    Alert.alert('Erro', 'Não foi possível remover dos favoritos');
                }
            } else {
                const success = await addToFavorites(user.uid, recipe);
                if (success) {
                    setIsFav(true);
                    Alert.alert('Sucesso', 'Receita adicionada aos favoritos!');
                } else {
                    Alert.alert('Erro', 'Não foi possível adicionar aos favoritos');
                }
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Image source={{ uri: recipe.image }} style={styles.image} />

                <View style={styles.header}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <TouchableOpacity onPress={toggleFavorite} disabled={loading}>
                        <Icon
                            name="heart"
                            type="feather"
                            color={isFav ? 'red' : 'gray'}
                            size={28}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.description}>{recipe.description}</Text>
            </ScrollView>

            <BottomNavigation />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        paddingBottom: 100,
    },
    image: {
        width: '100%',
        height: 250,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    description: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingBottom: 20,
        color: '#333',
    },
});
