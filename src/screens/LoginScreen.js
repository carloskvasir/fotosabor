import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O estado de autenticação mudará automaticamente e redirecionará para AppStack
      console.log("Login realizado com sucesso");
    } catch (error) {
      let errorMessage = "Erro ao fazer login";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuário não encontrado";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Senha incorreta";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "Conta desabilitada";
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? "Entrando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
      
      <TouchableOpacity 
        style={styles.forgotLink} 
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.linkText}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.linkText}>
          Não tem uma conta? Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center"
  },
  forgotLink: {
    marginTop: 12,
    alignItems: "center"
  },
  linkText: {
    color: "#3b5998",
    fontSize: 16
  }
});
