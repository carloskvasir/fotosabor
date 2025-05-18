import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, SearchBar, Text } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation.js';

//TODO REMOVER E USAR UM BANCO DE DADOS
const data = new Array(20).fill({
    title: 'Torta de Frango Cremosa',
    description:
        'Massa leve e dourada, recheada com frango cremoso. Perfeita para qualquer momento do dia!',
    image:
        'https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg',
});

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <SearchBar
                placeholder="Buscar..."
                platform="default"
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
            />

            <FlatList
                data={data}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Card containerStyle={styles.card}>
                        <Card.Image source={{ uri: item.image }} style={styles.image} />
                        <Card.Title>{item.title}</Card.Title>
                        <Text style={styles.description}>{item.description}</Text>
                    </Card>
                )}
            />

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
    card: {
        flex: 1,
        margin: 5,
        padding: 0,
        borderRadius: 5,
    },
    image: {
        height: 100,
        width: '100%',
    },
    description: {
        padding: 10,
        fontSize: 12,
        color: '#333',
    },
});
