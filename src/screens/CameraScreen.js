import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';

import BottomNavigation from "../components/BottomNavigation";
import { analyzeImage } from "../service/geminiService";

const CameraScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(300));
    const [editableIngredients, setEditableIngredients] = useState([]);
    const [showAddInput, setShowAddInput] = useState(false);
    const [newIngredient, setNewIngredient] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

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
        // Reset analysis state when taking new photo
        setAnalysisResult(null);
        setShowResult(false);
        setEditableIngredients([]);
        setShowAddInput(false);
        setNewIngredient('');
        setShowAddModal(false);
        
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
        // Reset analysis state when picking new image
        setAnalysisResult(null);
        setShowResult(false);
        setEditableIngredients([]);
        setShowAddInput(false);
        setNewIngredient('');
        setShowAddModal(false);
        
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

    const loadTestImage = async () => {
        // Reset analysis state when loading test image
        setAnalysisResult(null);
        setShowResult(false);
        setEditableIngredients([]);
        setShowAddInput(false);
        setNewIngredient('');
        setShowAddModal(false);
        
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

    const showAnalysisResult = (ingredientsList, success = true, message = '') => {
        setAnalysisResult({
            ingredients: ingredientsList,
            success,
            message,
            image: image
        });
        setShowResult(true);
        
        // Animate result panel
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideAnalysisResult = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowResult(false);
            setAnalysisResult(null);
            setEditableIngredients([]);
            setShowAddInput(false);
            setNewIngredient('');
            setShowAddModal(false);
        });
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

            // Show result with animation instead of immediate navigation
            if (ingredientsList.length > 0) {
                showAnalysisResult(ingredientsList, true);
                setEditableIngredients([...ingredientsList]); // Create a copy for editing
            } else {
                showAnalysisResult([], false, displayMessage);
            }

            return responseData;

        } catch (error) {
            console.error('Erro geral ao enviar para o Gemini:', error);
            showAnalysisResult([], false, 'Não foi possível conectar-se à API do Gemini.\nVerifique sua conexão e a chave de API.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const proceedToIngredients = () => {
        if (editableIngredients && editableIngredients.length > 0) {
            hideAnalysisResult();
            // Small delay to let animation finish
            setTimeout(() => {
                navigation.navigate('ListItensScreen', { 
                    identifiedIngredients: editableIngredients,
                    originalImage: analysisResult.image
                });
            }, 250);
        } else {
            Alert.alert('Atenção', 'Você removeu todos os ingredientes. Pelo menos um ingrediente é necessário para prosseguir.');
        }
    };

    const removeIngredient = (indexToRemove) => {
        const updatedIngredients = editableIngredients.filter((_, index) => index !== indexToRemove);
        setEditableIngredients(updatedIngredients);
    };

    const addNewIngredient = () => {
        const trimmedIngredient = newIngredient.trim();
        
        if (!trimmedIngredient) {
            Alert.alert('Atenção', 'Digite um ingrediente válido.');
            return;
        }
        
        if (trimmedIngredient.length < 2) {
            Alert.alert('Atenção', 'O ingrediente deve ter pelo menos 2 caracteres.');
            return;
        }
        
        if (editableIngredients.some(ingredient => 
            ingredient.toLowerCase() === trimmedIngredient.toLowerCase()
        )) {
            Alert.alert('Atenção', 'Este ingrediente já foi adicionado.');
            return;
        }
        
        setEditableIngredients([...editableIngredients, trimmedIngredient]);
        setNewIngredient('');
        setShowAddModal(false);
    };

    const cancelAddIngredient = () => {
        setNewIngredient('');
        setShowAddModal(false);
    };

    const retryAnalysis = () => {
        hideAnalysisResult();
        setTimeout(() => {
            sendImageToGemini(image);
        }, 250);
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
                        <Text style={styles.loadingText}>Analisando imagem...</Text>
                        <Text style={styles.loadingSubText}>Identificando ingredientes com IA</Text>
                    </View>
                )}
            </View>

            {/* Analysis Result Panel */}
            {showResult && (
                <Animated.View 
                    style={[
                        styles.resultOverlay,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.resultPanel}>
                        <View style={styles.resultHeader}>
                            <Icon 
                                name={analysisResult?.success ? "check-circle" : "alert-circle"} 
                                type="feather" 
                                size={24} 
                                color={analysisResult?.success ? "#4CAF50" : "#FF9800"} 
                            />
                            <Text style={styles.resultTitle}>
                                {analysisResult?.success ? "Análise Concluída!" : "Resultado da Análise"}
                            </Text>
                            <TouchableOpacity onPress={hideAnalysisResult}>
                                <Icon name="x" type="feather" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {analysisResult?.success ? (
                            <View style={styles.successContent}>
                                <Text style={styles.ingredientsCount}>
                                    {editableIngredients.length} ingrediente(s) identificado(s)
                                </Text>
                                <View style={styles.ingredientsList}>
                                    {editableIngredients.map((ingredient, index) => (
                                        <View key={index} style={styles.ingredientChip}>
                                            <Text style={styles.ingredientText}>{ingredient}</Text>
                                            <TouchableOpacity 
                                                style={styles.removeButton}
                                                onPress={() => removeIngredient(index)}
                                            >
                                                <Icon name="x" type="feather" size={14} color="#01579b" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    
                                    {/* Add ingredient button */}
                                    <TouchableOpacity 
                                        style={styles.addIngredientButton}
                                        onPress={() => setShowAddModal(true)}
                                    >
                                        <Icon name="plus" type="feather" size={16} color="#2089dc" />
                                        <Text style={styles.addIngredientText}>Adicionar</Text>
                                    </TouchableOpacity>
                                </View>
                                {editableIngredients.length === 0 && (
                                    <Text style={styles.noIngredientsText}>
                                        Todos os ingredientes foram removidos
                                    </Text>
                                )}
                                <View style={styles.resultActions}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.actionBtn, 
                                            styles.primaryBtn,
                                            editableIngredients.length === 0 && styles.disabledBtn
                                        ]} 
                                        onPress={proceedToIngredients}
                                        disabled={editableIngredients.length === 0}
                                    >
                                        <Text style={styles.primaryBtnText}>Buscar Receitas</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, styles.secondaryBtn]} 
                                        onPress={retryAnalysis}
                                    >
                                        <Text style={styles.secondaryBtnText}>Tentar Novamente</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.errorContent}>
                                <Text style={styles.errorMessage}>{analysisResult?.message}</Text>
                                <View style={styles.resultActions}>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, styles.primaryBtn]} 
                                        onPress={retryAnalysis}
                                    >
                                        <Icon name="refresh-cw" type="feather" size={18} color="white" />
                                        <Text style={styles.primaryBtnText}>Tentar Novamente</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, styles.secondaryBtn]} 
                                        onPress={hideAnalysisResult}
                                    >
                                        <Text style={styles.secondaryBtnText}>Voltar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </Animated.View>
            )}

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                    <Icon name="image" type="feather" size={28} color="#2089dc" />
                    <Text style={styles.buttonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
                    <Icon name="camera" type="feather" size={32} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={loadTestImage}>
                    <Icon name="image" type="feather" size={28} color="#2089dc" />
                    <Text style={styles.buttonText}>Teste</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        (!image || loading || showResult) && styles.disabledButton
                    ]}
                    onPress={saveImage}
                    disabled={!image || loading || showResult}
                >
                    <Icon
                        name="send"
                        type="feather"
                        size={28}
                        color={(!image || loading || showResult) ? "#ccc" : "#2089dc"}
                    />
                    <Text style={[styles.buttonText, (!image || loading || showResult) && styles.disabledText]}>Enviar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                    Tire uma foto, escolha uma da galeria, ou carregue uma imagem de teste para enviar para o Gemini
                </Text>
            </View>

            <BottomNavigation />

            {/* Modal para adicionar ingrediente */}
            <Modal
                visible={showAddModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelAddIngredient}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Adicionar Ingrediente</Text>
                        
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Digite o nome do ingrediente"
                            value={newIngredient}
                            onChangeText={setNewIngredient}
                            autoFocus={true}
                            onSubmitEditing={addNewIngredient}
                            returnKeyType="done"
                            maxLength={50}
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={cancelAddIngredient}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={addNewIngredient}
                            >
                                <Text style={styles.confirmButtonText}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    loadingSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    resultOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    resultPanel: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginLeft: 8,
    },
    successContent: {
        marginTop: 12,
    },
    ingredientsCount: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginBottom: 8,
    },
    ingredientsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    ingredientChip: {
        backgroundColor: '#e1f5fe',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ingredientText: {
        fontSize: 14,
        color: '#01579b',
        marginRight: 6,
    },
    removeButton: {
        padding: 2,
        borderRadius: 10,
        backgroundColor: 'rgba(1, 87, 155, 0.1)',
    },
    noIngredientsText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        marginVertical: 8,
    },
    addIngredientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
        borderWidth: 1,
        borderColor: '#2089dc',
        borderStyle: 'dashed',
    },
    addIngredientText: {
        fontSize: 14,
        color: '#2089dc',
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '85%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f1f1f1',
    },
    cancelButtonText: {
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    },
    confirmButton: {
        backgroundColor: '#2089dc',
    },
    confirmButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    resultActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingVertical: 10,
        paddingHorizontal: 16,
        elevation: 2,
    },
    primaryBtn: {
        backgroundColor: '#2089dc',
    },
    disabledBtn: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    primaryBtnText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    secondaryBtn: {
        backgroundColor: '#f1f1f1',
    },
    secondaryBtnText: {
        color: '#333',
        fontWeight: '500',
    },
    errorContent: {
        marginTop: 12,
    },
    errorMessage: {
        fontSize: 14,
        color: '#c0392b',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default CameraScreen;