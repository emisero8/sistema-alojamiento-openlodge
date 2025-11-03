import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { styles } from "./styles/MenuMiCuentaAnfitrionStyles";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // ⬅️ BORRADO
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext"; // ⬅️ AÑADIDO
import { Propiedad } from "../types/Propiedad"; // ⬅️ AÑADIDO

const imagenes: Record<string, any> = {
    "/img/propiedades/1/IMG1.jpg": require("../assets/propiedades/1/IMG1.jpg"),
    "/img/propiedades/2/IMG1.jpg": require("../assets/propiedades/2/IMG1.jpg"),
    "/img/propiedades/3/IMG1.jpg": require("../assets/propiedades/3/IMG1.jpg"),
    "/img/propiedades/4/IMG1.jpg": require("../assets/propiedades/4/IMG1.jpg"),
    "/img/propiedades/5/IMG1.jpg": require("../assets/propiedades/5/IMG1.jpg"),
    "/img/propiedades/6/IMG1.jpg": require("../assets/propiedades/6/IMG1.jpg"),
    "/img/propiedades/7/IMG1.jpg": require("../assets/propiedades/7/IMG1.jpg"),
    "/img/propiedades/8/IMG1.jpg": require("../assets/propiedades/8/IMG1.jpg"),
    "/img/propiedades/9/IMG1.jpg": require("../assets/propiedades/9/IMG1.jpg"),
};

const API_URL = "http://192.168.0.5:8080";

type MenuMiCuentaAnfitrionNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuMiCuentaA"
>;

export const MenuMiCuentaAnfitrionScreen: React.FC = () => {
    const navigation = useNavigation<MenuMiCuentaAnfitrionNavigationProp>();

    // Obtenemos los datos del Contexto
    const { token, nombre, apellido, email, logout } = useAuth();

    const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar solo las propiedades (para el contador)
    const cargarPropiedades = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/propiedades/mis-propiedades`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 403) {
                logout();
                return;
            }
            if (!response.ok) throw new Error('Error al cargar propiedades');
            const dataPropiedades: Propiedad[] = await response.json();
            setPropiedades(dataPropiedades);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarPropiedades();
        }, [token])
    );

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={{ marginTop: 10 }}>Cargando cuenta...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/logoTerminado.png")} style={styles.logo}
                    /><Text style={styles.brandName}>OpenLodge</Text>
                </View>

                <View style={styles.topControls}>
                    {/* ... (Botones de navegación) ... */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuAnfitrion")}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button,styles.activeButton]}
                        onPress={() => navigation.navigate("MenuMiCuentaA")}
                    >
                        <Text style={styles.buttonText}>Mi Cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuGestionar")}
                    >
                        <Text style={styles.buttonText}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuPublicar" as never)}
                    >
                        <Text style={styles.buttonText}>Publicar propiedad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>

            {/* MAIN */}
            <View style={styles.main}>
                {/* SIDEBAR */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>
                        Bienvenido, <Text style={{ fontWeight: "700" }}>{nombre} {apellido}</Text>
                    </Text>
                    <View style={styles.profilePic}>
                        <Image
                            source={require("../assets/user_placeholder.png")}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.sidebarSubtitle}>Detalles de la cuenta:</Text>
                    <View style={styles.sidebarList}>
                        <Text style={styles.listItem}>• Email: {email}</Text>
                        <Text style={styles.listItem}>• Propiedades publicadas: {propiedades.length}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default MenuMiCuentaAnfitrionScreen;