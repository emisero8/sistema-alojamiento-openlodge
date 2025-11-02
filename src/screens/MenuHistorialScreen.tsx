import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { styles } from "./styles/MenuHistorialStyles";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // ⬅️ BORRADO
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext"; // ⬅️ AÑADIDO
import { Propiedad } from "../types/Propiedad"; // ⬅️ AÑADIDO

// (Tu mapa de imágenes estáticas - ¡Recuerda que debe usar la URL como clave!)
const imagenes: Record<string, any> = {
    "/img/propiedades/1/IMG1.jpg": require("../assets/propiedades/1/IMG1.jpg"),
    "/img/propiedades/2/IMG1.jpg": require("../assets/propiedades/2/IMG1.jpg"),
    // ...
    "/img/propiedades/9/IMG1.jpg": require("../assets/propiedades/9/IMG1.jpg"),
};

const API_URL = "http://localhost:8080";

type MenuHistorialNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuHistorial"
>;

export const MenuHistorialScreen: React.FC = () => {
    const navigation = useNavigation<MenuHistorialNavigationProp>();

    // 1. Obtenemos los datos del Contexto
    const { token, rol, nombre, apellido, email, logout } = useAuth();

    const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Cargar propiedades (la misma lógica de MenuAnfitrionScreen)
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
            const data: Propiedad[] = await response.json();
            setPropiedades(data);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Usamos 'useFocusEffect' para recargar
    useFocusEffect(
        useCallback(() => {
            cargarPropiedades();
        }, [token])
    );

    // 4. Lógica de filtrado (TEMPORAL)
    // TODO: A futuro, esto debe venir de un endpoint de 'Reservas'
    // Por ahora, 'disponibles' son todas, 'alquiladas' está vacío.
    const alquiladas: Propiedad[] = [];
    const disponibles: Propiedad[] = propiedades;

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={{ marginTop: 10 }}>Cargando historial...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/logoTerminado.png")} style={styles.logo} />
                    <Text style={styles.brandName}>OpenLodge</Text>
                </View>

                <View style={styles.topControls}>
                    {/* ... (Botones de navegación) ... */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuAnfitrion")}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.activeButton]}>
                        <Text style={[styles.buttonText, styles.activeText]}>Historial</Text>
                    </TouchableOpacity>
                    {/* ... (otros botones) ... */}

                    {/* 5. ¡Botón de Logout CONECTADO! */}
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MAIN */}
            <View style={styles.main}>
                {/* SIDEBAR */}
                <View style={styles.sidebar}>
                    {/* 6. ¡Datos del Contexto! */}
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
                        {/* TODO: Cargar el email del usuario en el AuthContext */}
                        <Text style={styles.listItem}>• Email: {email}</Text>
                        <Text style={styles.listItem}>• Propiedades publicadas: {propiedades.length}</Text>
                    </View>
                </View>

                {/* CONTENIDO */}
                <View style={styles.content}>
                    {error && <Text style={styles.emptyText}>Error: {error}</Text>}

                    <Text style={styles.sectionTitle}>Propiedades en alquiler: (TODO)</Text>
                    {alquiladas.length > 0 ? (
                        <View style={styles.grid}>
                            {/* ... (mapa de alquiladas) ... */}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No hay propiedades en alquiler.</Text>
                    )}

                    <Text style={styles.sectionTitle}>Propiedades disponibles:</Text>
                    {disponibles.length > 0 ? (
                        <View style={styles.grid}>
                            {disponibles.map((p) => (
                                <View key={p.id} style={styles.card}>
                                    {/* 7. ¡IMAGEN CORREGIDA! */}
                                    <Image
                                        source={
                                            imagenes[p.imagenPrincipalUrl]
                                                ? imagenes[p.imagenPrincipalUrl]
                                                : require("../assets/propiedades/default.png")
                                        }
                                        style={styles.cardImage}
                                    />
                                    {/* 8. ¡CAMPOS CORREGIDOS! */}
                                    <Text style={styles.cardTitle}>{p.titulo}</Text>
                                    <Text style={styles.cardDesc}>
                                        {p.descripcion || "Sin descripción"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No hay propiedades disponibles.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default MenuHistorialScreen;