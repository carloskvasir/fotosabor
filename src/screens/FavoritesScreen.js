import {View} from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import React from "react";

export default function FavoritesScreen() {

    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <BottomNavigation />
        </View>
    );
}