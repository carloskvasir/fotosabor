import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Text,
    Image,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';
import BottomNavigation from "../components/BottomNavigation";

const CameraScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);

    // Solicita permissões ao carregar o componente
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera');
                }
            }
        })();
    }, []);

    // Função para abrir a câmera
    const openCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Erro ao abrir câmera:', error);
            Alert.alert('Erro', 'Não foi possível acessar a câmera');
        }
    };

    // Função para abrir a galeria
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Erro ao abrir galeria:', error);
            Alert.alert('Erro', 'Não foi possível acessar suas fotos');
        }
    };

    // Função para salvar a imagem (simula o envio para um servidor)
    const saveImage = () => {
        if (image) {
            // Aqui você implementaria o código para enviar a imagem para seu servidor
            Alert.alert(
                'Imagem Salva',
                'Sua imagem foi salva com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Opcionalmente, você pode navegar de volta ou para outra tela
                            // navigation.goBack() ou navigation.navigate('OutraTela', { imageUri: image })
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Erro', 'Por favor, tire uma foto primeiro');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation ? navigation.goBack() : null}
                >
                    <Icon name="arrow-left" type="feather" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Câmera</Text>
                <View style={{ width: 40 }} /> {/* Espaço para balancear o layout */}
            </View>

            {/* Área de visualização da imagem */}
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Icon name="camera-off" type="feather" size={80} color="#ccc" />
                        <Text style={styles.placeholderText}>Nenhuma foto capturada</Text>
                    </View>
                )}
            </View>

            {/* Botões de ação */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <Icon name="image" type="feather" size={28} color="#2089dc" />
                    <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
                    <Icon name="camera" type="feather" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        !image && styles.disabledButton
                    ]}
                    onPress={saveImage}
                    disabled={!image}
                >
                    <Icon
                        name="check-circle"
                        type="feather"
                        size={28}
                        color={image ? "#2089dc" : "#ccc"}
                    />
                    <Text style={[styles.buttonText, !image && styles.disabledText]}>Salvar</Text>
                </TouchableOpacity>
            </View>

            {/* Instruções */}
            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Tire uma foto ou escolha uma da galeria para continuar
                </Text>
            </View>

            <BottomNavigation />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e4e8',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: '#eee',
        borderRadius: 12,
        overflow: 'hidden',
    },
    preview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        marginTop: 8,
        fontSize: 14,
        color: '#333',
    },
    cameraButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#2089dc',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledText: {
        color: '#999',
    },
    instructions: {
        padding: 20,
        alignItems: 'center',
    },
    instructionText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
});

export default CameraScreen;