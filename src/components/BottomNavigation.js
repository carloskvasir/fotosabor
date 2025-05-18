import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.bottomNav}>
            <Icon
                name="menu"
                type="feather"
                color="#fff"
                onPress={() => navigation.replace('Home')}
            />
            <Icon
                name="camera"
                type="feather"
                color="#fff"
                onPress={() => navigation.replace('Camera')}
            />
            <Icon
                name="heart"
                type="feather"
                color="#fff"
                onPress={() => navigation.replace('Favorites')}
            />
            <Icon
                name="user"
                type="feather"
                color="#fff"
                onPress={() => navigation.replace('Profile')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#3b5998',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

export default BottomNavigation;
