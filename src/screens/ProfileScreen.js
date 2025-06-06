import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                // Usuário não autenticado, redirecionar para login
                navigation.replace('Login');
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, [navigation]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logout', 'Você saiu da sua conta.');
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível fazer logout');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (!user) {
        return null; // Será redirecionado para login
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ 
                        uri: user.photoURL || 'https://cdn-icons-png.flaticon.com/512/5556/5556520.png' 
                    }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>
                    {user.displayName || 'Usuário'}
                </Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.info}>📧 {user.email}</Text>

                    <Text style={styles.label}>Conta criada em</Text>
                    <Text style={styles.info}>
                        📅 {user.metadata.creationTime ? 
                            new Date(user.metadata.creationTime).toLocaleDateString('pt-BR') : 
                            'Data não disponível'
                        }
                    </Text>

                    <Text style={styles.label}>Último acesso</Text>
                    <Text style={styles.info}>
                        🕒 {user.metadata.lastSignInTime ? 
                            new Date(user.metadata.lastSignInTime).toLocaleDateString('pt-BR') : 
                            'Data não disponível'
                        }
                    </Text>
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
