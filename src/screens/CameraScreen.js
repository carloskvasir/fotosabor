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
    Platform,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Icon } from 'react-native-elements';

import BottomNavigation from "../components/BottomNavigation";
import { analyzeImage } from "../service/geminiService";

const CameraScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    //todo remover, apenas para teste e apresentações com o emulador
    const loadTestImage = async () => {
        const testImageUrl = 'https://img.freepik.com/fotos-gratis/vista-superior-tomate-na-tabua-com-limao-pepino-queijo-verduras-na-superficie-cinza_176474-6504.jpg?semt=ais_hybrid&w=740';

        setLoading(true);
        try {
            const { uri } = await FileSystem.downloadAsync(
                testImageUrl,
                FileSystem.cacheDirectory + 'gemini_test_image.jpg'
            );

            setImage(uri);
            Alert.alert("Sucesso", "Imagem de teste carregada para simulação.");
        } catch (error) {
            console.error("Erro ao carregar imagem de teste:", error);
            Alert.alert("Erro", "Não foi possível carregar a imagem de teste.\nVerifique a URL e sua conexão.");
        } finally {
            setLoading(false);
        }
    };

    const sendImageToGemini = async (imageUri) => {
        setLoading(true);
        try {
            const prompt = "Analise esta imagem e me forneça uma lista dos ingredientes principais que você consegue identificar. Retorne a resposta em formato JSON, onde a chave principal é 'ingredientes' e o valor é um array de strings, cada string sendo o nome de um ingrediente. Por exemplo: {'ingredientes': ['tomate', 'cebola', 'queijo']}. Priorize ingredientes culinários visíveis e comuns em receitas. Se não conseguir identificar ingredientes culinários, retorne uma lista vazia.";
            const responseData = await analyzeImage(imageUri, prompt);

            console.log('Resposta bruta do Gemini:', JSON.stringify(responseData, null, 2));

            let ingredientsList = [];
            let displayMessage = 'Nenhum ingrediente identificado.';

            try {
                const geminiTextResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

                if (geminiTextResponse) {
                    const jsonMatch = geminiTextResponse.match(/```json\s*(\{.*\})\s*```/s);
                    let jsonString = geminiTextResponse;

                    if (jsonMatch && jsonMatch[1]) {
                        jsonString = jsonMatch[1];
                    }

                    const parsedResponse = JSON.parse(jsonString);

                    if (parsedResponse && parsedResponse.ingredientes && Array.isArray(parsedResponse.ingredientes)) {
                        ingredientsList = parsedResponse.ingredientes;
                    } else {
                        displayMessage = `Resposta do Gemini:\n${geminiTextResponse}`;
                        console.warn("Resposta do Gemini não é um JSON com 'ingredientes':", parsedResponse);
                    }
                } else {
                    displayMessage = "O Gemini não retornou nenhum texto descritivo.";
                }

            } catch (parseError) {
                console.error("Erro ao parsear JSON do Gemini:", parseError);
                displayMessage = `Erro ao interpretar a resposta do Gemini.\n\nResposta bruta: ${responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'Vazio'}`;
            }

            navigation.navigate('ListItensScreen', { identifiedIngredients: ingredientsList });

            if (ingredientsList.length > 0) {
                Alert.alert(
                    'Ingredientes Identificados',
                    `Os ingredientes são:\n${ingredientsList.join(', ')}`,
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Resultado da Análise',
                    displayMessage,
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
            }

            return responseData;

        } catch (error) {
            console.error('Erro geral ao enviar para o Gemini:', error);
            Alert.alert('Erro de Conexão', 'Não foi possível conectar-se à API do Gemini.\nVerifique sua conexão e a chave de API.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const saveImage = async () => {
        if (image) {
            await sendImageToGemini(image);
        } else {
            Alert.alert('Erro', 'Por favor, tire ou selecione uma foto primeiro.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation ? navigation.goBack() : null}
                >
                    <Icon name="arrow-left" type="feather" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Câmera</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.preview} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Icon name="camera-off" type="feather" size={80} color="#ccc" />
                        <Text style={styles.placeholderText}>Nenhuma foto capturada</Text>
                    </View>
                )}
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#2089dc" />
                        <Text style={styles.loadingText}>Enviando para o Gemini...</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <Icon name="image" type="feather" size={28} color="#2089dc" />
                    <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
                    <Icon name="camera" type="feather" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={loadTestImage}>
                    <Icon name="test-image" type="font-awesome-5" size={28} color="#2089dc" />
                    <Text style={styles.buttonText}>Teste</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        (!image || loading) && styles.disabledButton
                    ]}
                    onPress={saveImage}
                    disabled={!image || loading}
                >
                    <Icon
                        name="send"
                        type="feather"
                        size={28}
                        color={(!image || loading) ? "#ccc" : "#2089dc"}
                    />
                    <Text style={[styles.buttonText, (!image || loading) && styles.disabledText]}>Enviar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Tire uma foto, escolha uma da galeria, ou carregue uma imagem de teste para enviar para o Gemini
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default CameraScreen;