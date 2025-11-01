import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
// 1. Ya no necesitamos 'useNavigation' ni 'AsyncStorage'
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "../navigation/StackNavigation";
import { loginStyles as styles } from "./styles/LoginStyles";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// 2. ¡Importamos nuestro hook 'useAuth' del contexto!
import { useAuth } from "../context/AuthContext";

// 3. Ya no necesitamos los types de navegación
// type LoginScreenNavigationProp = StackNavigationProp<
//     RootStackParamList,
//     "Login"
// >;

// 4. La API_URL también se fue (ahora está en el contexto)
// const API_URL = "http://localhost:8080";

const LoginScreen: React.FC = () => {
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [cargando, setCargando] = useState(false);
    // const navigation = useNavigation<LoginScreenNavigationProp>(); // ⬅️ Ya no se usa

    // 5. Obtenemos la función 'login' de nuestro AuthContext
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!correo || !clave) {
            Alert.alert("Error", "Por favor complete todos los campos.");
            return;
        }

        setCargando(true); // Empezamos a cargar

        try {
            // 6. ¡Llamamos a la función 'login' del contexto!
            // Esta función se encarga de TODO:
            // - Hacer el fetch
            // - Mostrar alertas de error
            // - Guardar el token en AsyncStorage
            // - Actualizar el estado global (token y rol)
            await login(correo, clave);

        } catch (error) {
            // Por si ocurre un error inesperado
            console.error(error);
            Alert.alert("Error", "Ocurrió un error inesperado.");
        } finally {
            // Si el login falló, el contexto ya mostró la alerta
            // y aquí simplemente detenemos el spinner.
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 7. El JSX (toda la parte visual) queda EXACTAMENTE IGUAL */}
            <View style={styles.loginBox}>
                <Text style={styles.title}>Sistema de Reservas</Text>

                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ejemplo@email.com"
                    keyboardType="email-address"
                    value={correo}
                    onChangeText={setCorreo}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={clave}
                    onChangeText={setClave}
                />

                {cargando ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={cargando}
                    >
                        <Text style={styles.buttonText}>Ingresar</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity>
                    <Text style={styles.link}>¿Primera vez? Crear cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.googleButton]}>
                    <Text style={styles.buttonText}>Ingresar con Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoginScreen;