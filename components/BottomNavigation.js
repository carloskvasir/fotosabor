import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const BottomNavigation = () => {
    return (
        <View style={styles.bottomNav}>
            <Icon name="menu" type="feather" color="#fff" />
            <Icon name="camera" type="feather" color="#fff" />
            <Icon name="heart" type="feather" color="#fff" />
            <Icon name="user" type="feather" color="#fff" />
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
