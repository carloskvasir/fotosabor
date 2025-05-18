import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

export default function ListItensScreen() {

    const [itens, setItens] = useState([
        { id: '1', nome: 'OVO'},
        { id: '2', nome: 'LEITE' },
        { id: '3', nome: 'MACARRÃO' },
        { id: '4', nome: 'BATATA' },
        { id: '5', nome: 'MELANCIA' },
        { id: '6', nome: 'CREME DE LEITE' },
        { id: '7', nome: 'SUCO DE LARANJA' },
        { id: '8', nome: 'TAPIOCA' },
    ]);

    const deletarItem = (id) => {
        setItens((prev) => prev.filter((item) => item.id !== id));
    };

    const renderRightActions = (itemId) => (
        <TouchableOpacity
            style={styles.deleteAction}
            onPress={() => deletarItem(itemId)}
        >
            <Ionicons name="trash-outline" size={24} color="white" />
            <Text style={styles.deleteText}>Deletar</Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            overshootRight={false}
        >
            <View style={[
                styles.itemContainer,
                styles.regularItem
            ]}>
                <Text style={styles.itemText}>{item.nome}</Text>
            </View>
        </Swipeable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={itens}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 15 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkButton}>
                    <Ionicons name="checkmark" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.frameText}>Frame</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
    },
    regularItem: {
        backgroundColor: '#a6b1f2',
    },
    itemText: {
        color: 'white',
        fontWeight: '500',
    },
    deleteAction: {
        backgroundColor: '#ff6961',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginVertical: 5,
        borderRadius: 10,
    },
    deleteText: {
        color: 'white',
        fontWeight: '500',
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        height: 60,
        backgroundColor: '#a6caf0',
    },
    addButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameText: {
        textAlign: 'right',
        color: '#a6caf0',
        fontSize: 12,
        paddingRight: 10,
        paddingBottom: 5,
    },
});

