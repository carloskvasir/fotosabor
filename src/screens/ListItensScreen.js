import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { generateRecipes } from "../service/geminiService";

export default function ListItensScreen({ route, navigation }) {

    const { identifiedIngredients } = route.params || { identifiedIngredients: [] };
    const [itens, setItens] = useState([]);
    const [loadingRecipes, setLoadingRecipes] = useState(false);

    useEffect(() => {

        if (identifiedIngredients.length > 0) {
            const newItems = identifiedIngredients.map((ingredient, index) => ({
                id: `gemini-${Date.now()}-${index}`,
                nome: ingredient.toUpperCase(),
            }));

            setItens(newItems);
            Alert.alert("Sucesso", "Ingredientes da imagem adicionados à lista!");
        } else {

            setItens([]);
        }

    }, [identifiedIngredients]);

    const deletarItem = (id) => {
        setItens((prev) => prev.filter((item) => item.id !== id));
    };

    const handleGenerateRecipes = async () => {
        if (itens.length === 0) {
            Alert.alert("Lista Vazia", "Adicione ingredientes à lista antes de gerar receitas.");
            return;
        }

        setLoadingRecipes(true);
        try {
            const ingredientNames = itens.map(item => item.nome);
            const responseData = await generateRecipes(ingredientNames);

            console.log('Resposta bruta do Gemini (Receitas):', JSON.stringify(responseData, null, 2));

            let recipes = [];
            let displayMessage = 'Nenhuma receita identificada.';

            try {
                const geminiTextResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

                if (geminiTextResponse) {
                    const jsonMatch = geminiTextResponse.match(/```json\s*(\{.*\})\s*```/s);
                    let jsonString = geminiTextResponse;

                    if (jsonMatch && jsonMatch[1]) {
                        jsonString = jsonMatch[1];
                    }

                    const parsedResponse = JSON.parse(jsonString);

                    if (parsedResponse && parsedResponse.receitas && Array.isArray(parsedResponse.receitas)) {
                        recipes = parsedResponse.receitas;
                    } else {
                        displayMessage = `Resposta do Gemini:\n${geminiTextResponse}`;
                        console.warn("Resposta do Gemini não é um JSON com 'receitas':", parsedResponse);
                    }
                } else {
                    displayMessage = "O Gemini não retornou nenhum texto descritivo para receitas.";
                }

            } catch (parseError) {
                console.error("Erro ao parsear JSON de receitas do Gemini:", parseError);
                displayMessage = `Erro ao interpretar a resposta das receitas do Gemini.\n\nResposta bruta: ${responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'Vazio'}`;
            }

            if (recipes.length > 0) {
                // TODO MUDAR PARA A HOMESCREEN
                let recipesText = recipes.map((recipe, index) =>
                    `Receita ${index + 1}: ${recipe.nome}\nIngredientes: ${recipe.ingredientes.join(', ')}\nInstruções: ${recipe.instrucoes}`
                ).join('\n\n---\n\n');

                Alert.alert(
                    'Receitas Sugeridas',
                    recipesText,
                    [{ text: 'OK' }]
                );

            } else {
                Alert.alert(
                    'Nenhuma Receita',
                    displayMessage,
                    [{ text: 'OK' }]
                );
            }

        } catch (error) {
            console.error('Erro geral ao enviar ingredientes para o Gemini (receitas):', error);
            Alert.alert('Erro de Conexão', 'Não foi possível conectar-se à API do Gemini para gerar receitas.\nVerifique sua conexão e a chave de API.');
        } finally {
            setLoadingRecipes(false);
        }
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
                ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>Nenhum ingrediente adicionado ainda.</Text>
                        <Text style={styles.emptyListText}>Use a câmera para identificar!</Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkButton}
                    onPress={handleGenerateRecipes}
                    disabled={loadingRecipes}
                >
                    {loadingRecipes ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="checkmark" size={24} color="white" />
                    )}
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
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyListText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
});