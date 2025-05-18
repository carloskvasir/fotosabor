import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';

export default function RecipeDetailScreen({ route }) {

    const { recipe } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    //todo salvar o favorito no banco
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Image source={{ uri: recipe.image }} style={styles.image} />

                <View style={styles.header}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <TouchableOpacity onPress={toggleFavorite}>
                        <Icon
                            name="heart"
                            type="feather"
                            color={isFavorite ? 'red' : 'gray'}
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
