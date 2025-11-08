import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { loginStyles as styles } from "./styles/LoginStyles";

import { useAuth } from "../context/AuthContext";

type LoginScreenNavigationProp = StackNavigationProp<
     RootStackParamList,
     "Login"
>;

// La API_URL  está en el contexto

const LoginScreen: React.FC = () => {
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigation = useNavigation<LoginScreenNavigationProp>();
    
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!correo || !clave) {
            Alert.alert("Error", "Por favor complete todos los campos.");
            return;
        }

        setCargando(true);

        try {
            // Llamamos a la función login del contexto
            await login(correo, clave);

        } catch (error) {
            // Por si ocurre un error inesperado
            console.error(error);
            Alert.alert("Error", "Ocurrió un error inesperado.");
        } finally {
            // Si el login falló, el contexto ya mostró la alerta
            // y aca detenemos el spinner
            setCargando(false);
        }
    };

    return (
        <View style={styles.container}>
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

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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