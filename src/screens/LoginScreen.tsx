import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import usuarios from "../data/usuarios.json";
import { Usuario } from "../types/Usuario";
import { loginStyles as styles } from "./styles/LoginStyles";

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Login"
>;

const LoginScreen: React.FC = () => {
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const navigation = useNavigation<LoginScreenNavigationProp>();

    const handleLogin = () => {
        if (!correo || !clave) {
            Alert.alert("Error", "Por favor complete todos los campos.");
            return;
        }

        const usuario: Usuario | undefined = usuarios.find(
            (u) => u.correo === correo && u.clave === clave
        );

        if (usuario) {
            Alert.alert("Bienvenido", `${usuario.rol}: ${usuario.correo}`);

            // ✅ Redirección según el rol
            if (usuario.rol === "Huesped") {
                navigation.replace("MenuHuesped");
            } else if (usuario.rol === "Anfitrion") {
                navigation.replace("MenuAnfitrion");
            } else {
                Alert.alert("Error", "Rol desconocido.");
            }
        } else {
            Alert.alert("Error", "Correo o contraseña incorrectos.");
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
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={clave}
                    onChangeText={setClave}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Ingresar</Text>
                </TouchableOpacity>

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
