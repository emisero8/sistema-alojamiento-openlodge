import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { styles } from "./styles/RegisterStyles";


type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Register"
>;

const API_URL = "http://192.168.0.5:8080";

type UserRole = "HUESPED" | "ANFITRION";

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [rol, setRol] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // 5. Validaciones
        if (!nombre || !apellido || !correo || !clave || !rol) {
            Alert.alert("Error", "Por favor complete todos los campos.");
            return;
        }

        setLoading(true);

        try {
            // 6. ¡Llamada al endpoint de Registro!
            const response = await fetch(`${API_URL}/api/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    email: correo,    // El backend espera 'email'
                    password: clave,  // El backend espera 'password'
                    rol: rol,         // "HUESPED" o "ANFITRION"
                }),
            });

            // 7. Manejo de Errores
            if (response.status === 409) { // 409 Conflict (Email duplicado)
                Alert.alert("Error", "El email ya se encuentra registrado.");
            } else if (!response.ok) {
                const errorData = await response.text();
                Alert.alert("Error de registro", errorData || "No se pudo crear la cuenta.");
            } else {
                // 8. ¡Éxito!
                Alert.alert(
                    "¡Cuenta Creada!",
                    "Tu cuenta ha sido creada exitosamente. Por favor, inicia sesión.",
                    [
                        // Llevamos al usuario al Login
                        { text: "OK", onPress: () => navigation.navigate("Login") }
                    ]
                );
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error de red", "No se pudo conectar al servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Usamos ScrollView para que no se corte en pantallas chicas
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.loginBox}>
                <Text style={styles.title}>Crear Cuenta</Text>

                {/* --- Selector de Rol --- */}
                <Text style={styles.label}>Quiero registrarme como:</Text>
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            rol === 'HUESPED' && styles.roleButtonSelected
                        ]}
                        onPress={() => setRol('HUESPED')}
                    >
                        <Text style={rol === 'HUESPED' ? styles.roleTextSelected : styles.roleText}>
                            Huésped
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            rol === 'ANFITRION' && styles.roleButtonSelected
                        ]}
                        onPress={() => setRol('ANFITRION')}
                    >
                        <Text style={rol === 'ANFITRION' ? styles.roleTextSelected : styles.roleText}>
                            Anfitrión
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- Formulario --- */}
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.label}>Apellido</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu apellido"
                    value={apellido}
                    onChangeText={setApellido}
                />

                <Text style={styles.label}>Correo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ejemplo@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Registrarme</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>¿Ya tienes cuenta? Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default RegisterScreen;