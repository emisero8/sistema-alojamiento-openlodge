import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput, // Mantenemos el TextInput aunque no se use en el header
    TouchableOpacity,
    Image,
    ScrollView,
    Modal, // Mantenemos el Modal aunque no se use
    ActivityIndicator,
    Alert,
    FlatList, // Usaremos FlatList para la lista
} from "react-native";
// (Importa los estilos de Huesped, ya que dijiste que mantenga la estética)
import { styles } from "./styles/MenuMiCuentaStyles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { Propiedad } from "../types/Propiedad"; // Importamos el tipo global

// Definimos el tipo Reserva (¡Nuevo!)
interface UsuarioSimple {
    nombre: string;
    apellido: string;
    email: string;
}
interface Reserva {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    precioTotal: number;
    notas: string;
    propiedad: Propiedad;
    huesped: UsuarioSimple;
}

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

type MiCuentaNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuMiCuenta"
>;

export const MiCuentaScreen: React.FC = () => {
    const navigation = useNavigation<MiCuentaNavigationProp>();
    const { token, rol, nombre, apellido, email, logout } = useAuth();

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar solo las reservas del Huésped
    const cargarMisReservas = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            // ¡Llamamos al endpoint de Huésped!
            const response = await fetch(`${API_URL}/api/reservas/mis-reservas`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 403) {
                logout();
                return;
            }
            if (!response.ok) throw new Error('Error al cargar mis reservas');

            const dataReservas: Reserva[] = await response.json();
            setReservas(dataReservas);

        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Usamos 'useFocusEffect' para recargar
    useFocusEffect(
        useCallback(() => {
            cargarMisReservas();
        }, [token])
    );

    const cancelarMiReserva = (reserva: Reserva) => {
        if (!token) {
            Alert.alert("Error", "No estás autenticado.");
            return;
        }

        // 1. Usamos 'Alert.alert' nativo para confirmar
        Alert.alert(
            "Confirmar Cancelación",
            `¿Seguro que deseas cancelar tu reserva en "${reserva.propiedad.titulo}"?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, Cancelar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // 2. Llamamos a la API DELETE del Huésped
                            const response = await fetch(`${API_URL}/api/reservas/mis-reservas/${reserva.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.status === 403) {
                                Alert.alert("Error", "No tienes permiso o tu sesión expiró.");
                                logout();
                                return;
                            }
                            if (response.status === 409 || response.status === 400) {
                                const errorMessage = await response.text();
                                Alert.alert("No se pudo cancelar", errorMessage);
                            } else if (!response.ok && response.status !== 204) {
                                throw new Error("No se pudo cancelar la reserva.");
                            } else {
                                Alert.alert("Éxito", "Reserva cancelada correctamente.");
                                // Recargamos la lista
                                setReservas(prev => prev.filter((r) => r.id !== reserva.id));
                            }

                        } catch (err: any) {
                            Alert.alert("Error", err.message || "Ocurrió un problema.");
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={{ marginTop: 10 }}>Cargando mi cuenta...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HEADER (Estilo Huésped) */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/logoTerminado.png")} style={styles.logo}
                    /><Text style={styles.brandName}>OpenLodge</Text>
                </View>

                {/* Usamos 'topControls' como en el estilo de Historial */}
                <View style={styles.topControls}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuHuesped")}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.activeButton]}>
                        <Text style={[styles.buttonText, styles.activeText]}>Mi Cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MAIN (Usando la estructura de Historial: sidebar + content) */}
            <View style={styles.main}>
                {/* SIDEBAR (Con info del Huésped) */}
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
                        <Text style={styles.listItem}>• Rol: {rol}</Text>
                        <Text style={styles.listItem}>
                            • Reservas realizadas: {reservas.length}
                        </Text>
                    </View>
                </View>

                {/* CONTENIDO (Historial de Reservas del Huésped) */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Mi Historial de Reservas:</Text>

                    {error && <Text style={styles.emptyText}>Error: {error}</Text>}

                    {!loading && !error && reservas.length === 0 ? (
                        <Text style={styles.emptyText}>No has realizado ninguna reserva.</Text>
                    ) : (
                        <View style={styles.grid}>
                            {reservas.map((r) => {
                                // 4. Comprobamos si la reserva es futura
                                const hoy = new Date();
                                const fechaInicioReserva = new Date(r.fechaInicio + 'T00:00:00-03:00');
                                hoy.setHours(0, 0, 0, 0);
                                const esFutura = fechaInicioReserva > hoy;

                                return (
                                    <View key={r.id} style={styles.card}>
                                        <Image
                                            source={
                                                imagenes[r.propiedad.imagenPrincipalUrl]
                                                    ? imagenes[r.propiedad.imagenPrincipalUrl]
                                                    : require("../assets/propiedades/default.png")
                                            }
                                            style={styles.cardImage}
                                        />
                                        <Text style={styles.cardTitle}>{r.propiedad.titulo}</Text>
                                        <Text style={styles.cardDesc}>
                                            Desde: {r.fechaInicio}
                                        </Text>
                                        <Text style={styles.cardDesc}>
                                            Hasta: {r.fechaFin}
                                        </Text>
                                        <Text style={styles.cardDesc}>
                                            Total: ${r.precioTotal.toLocaleString()}
                                        </Text>

                                        {/* 5. ¡NUEVO BOTÓN CONDICIONAL! */}
                                        <View style={styles.actions}>
                                            {esFutura ? (
                                                <TouchableOpacity
                                                    style={styles.btnCancelar}
                                                    onPress={() => cancelarMiReserva(r)}
                                                >
                                                    <Text style={styles.btnCancelarText}>Cancelar reserva</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity style={styles.btnDeshabilitado} disabled>
                                                    <Text style={styles.btnDeshabilitadoText}>Reserva completada</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default MiCuentaScreen;