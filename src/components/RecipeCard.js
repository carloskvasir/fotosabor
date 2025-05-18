import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-elements';

const RecipeCard = ({ item, showHeart = false }) => {
    return (
        <Card containerStyle={styles.card}>
            <View>
                <Card.Image source={{ uri: item.image }} style={styles.image} />
                {showHeart && (
                    <Icon
                        name="heart"
                        type="feather"
                        color="red"
                        containerStyle={styles.heartIcon}
                    />
                )}
            </View>
            <Card.Title>{item.title}</Card.Title>
            <Text style={styles.description}>{item.description}</Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 5,
        padding: 0,
        borderRadius: 5,
    },
    image: {
        height: 100,
        width: '100%',
        borderRadius: 5,
    },
    heartIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 4,
    },
    description: {
        padding: 10,
        fontSize: 12,
        color: '#333',
    },
});

export default RecipeCard;
