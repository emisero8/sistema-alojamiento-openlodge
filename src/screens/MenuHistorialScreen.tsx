import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { styles } from "./styles/MenuHistorialStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface Propiedad {
    id: string;
    title: string;
    img: string;
    descripcion?: string;
    alquilada?: boolean;
}

export const MenuHistorialScreen: React.FC = () => {
    const navigation = useNavigation();
    const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPropiedades = async () => {
            try {
                const data = await AsyncStorage.getItem("propiedades");
                const lista: Propiedad[] = data ? JSON.parse(data) : [];
                setPropiedades(lista);
            } catch (error) {
                console.error("Error al cargar propiedades:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarPropiedades();
    }, []);

    const alquiladas = propiedades.filter((p) => p.alquilada);
    const disponibles = propiedades.filter((p) => !p.alquilada);

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
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuAnfitrion" as never)}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.activeButton]}>
                        <Text style={[styles.buttonText, styles.activeText]}>Historial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuGestionar" as never)}
                    >
                        <Text style={styles.buttonText}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuPublicar" as never)}
                    >
                        <Text style={styles.buttonText}>Publicar propiedad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MAIN */}
            <View style={styles.main}>
                {/* SIDEBAR */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>
                        Bienvenido, <Text style={{ fontWeight: "700" }}>Anfitrión</Text>
                    </Text>
                    <View style={styles.profilePic}>
                        <Image
                            source={require("../assets/user_placeholder.png")}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.sidebarSubtitle}>Detalles de la cuenta:</Text>
                    <View style={styles.sidebarList}>
                        <Text style={styles.listItem}>• Email: anfitrion@email.com</Text>
                        <Text style={styles.listItem}>• Teléfono: +54 111 222 333</Text>
                        <Text style={styles.listItem}>
                            • Propiedades publicadas: {propiedades.length}
                        </Text>
                    </View>
                </View>

                {/* CONTENIDO */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Propiedades en alquiler:</Text>
                    {alquiladas.length > 0 ? (
                        <View style={styles.grid}>
                            {alquiladas.map((p) => (
                                <View key={p.id} style={styles.card}>
                                    <Image
                                        source={
                                            p.img
                                                ? { uri: p.img }
                                                : require("../assets/propiedades/default.png")
                                        }
                                        style={styles.cardImage}
                                    />
                                    <Text style={styles.cardTitle}>{p.title}</Text>
                                    <Text style={styles.cardDesc}>
                                        {p.descripcion || "Sin descripción"}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.emptyText}>No hay propiedades en alquiler.</Text>
                    )}

                    <Text style={styles.sectionTitle}>Propiedades disponibles:</Text>
                    {disponibles.length > 0 ? (
                        <View style={styles.grid}>
                            {disponibles.map((p) => (
                                <View key={p.id} style={styles.card}>
                                    <Image
                                        source={
                                            p.img
                                                ? { uri: p.img }
                                                : require("../assets/propiedades/default.png")
                                        }
                                        style={styles.cardImage}
                                    />
                                    <Text style={styles.cardTitle}>{p.title}</Text>
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
