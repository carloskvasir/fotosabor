import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen() {

    //todo dados validar banco
    const handleLogout = () => {
        Alert.alert('Logout', 'Você saiu da sua conta.');
    };

    return (

        //todo dados validar banco
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5556/5556520.png' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>João da Silva</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Telefone</Text>
                    <Text style={styles.info}>📞 (11) 98765-4321</Text>

                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.info}>📧 joao.silva@email.com</Text>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <BottomNavigation />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingTop: 60,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#3b5998',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    infoContainer: {
        width: '100%',
        marginBottom: 30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 10,
    },
    info: {
        fontSize: 16,
        color: '#444',
    },
    logoutButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
