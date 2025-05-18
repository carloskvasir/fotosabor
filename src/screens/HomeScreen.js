import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import BottomNavigation from '../components/BottomNavigation';
import RecipeCard from '../components/RecipeCard';
import {useNavigation} from "@react-navigation/native";

//TODO TROCAR PARA BANCO
const data = new Array(20).fill({
    title: 'Torta de Frango Cremosa',
    description: 'Massa leve e dourada, recheada com frango cremoso.',
    image: 'https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg',
});

export default function HomeScreen() {

    const navigation = useNavigation();

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
                    <RecipeCard
                        item={item}
                        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                    />
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
});
