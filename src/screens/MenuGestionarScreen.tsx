import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { styles } from "./styles/MenuGestionarStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { Propiedad } from "../types/Propiedad";
import { useAuth } from "../context/AuthContext";



// Definimos la URL de la API
const API_URL = 'http://192.168.0.5:8080';

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

export const MenuGestionarScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { token, logout } = useAuth();

    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const cargarReservas = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/reservas/de-mis-propiedades`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 403) {
                logout();
                return;
            }
            if (!response.ok) throw new Error('Error al cargar reservas');
            const data: Reserva[] = await response.json();
            setReservas(data);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Usamos 'useFocusEffect'
    useFocusEffect(
        useCallback(() => {
            cargarReservas();
        }, [token])
    );

    // Lógica de botones
    const cancelarReserva = (reserva: Reserva) => {
        if (!token) {
            Alert.alert("Error", "No estás autenticado.");
            return;
        }

        // 1. Usamos 'Alert.alert' nativo para confirmar
        Alert.alert(
            "Confirmar Cancelación",
            `¿Seguro que deseas cancelar la reserva de ${reserva.huesped.nombre} en "${reserva.propiedad.titulo}"?`,
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí, Cancelar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // 2. Llamamos a la API con DELETE
                            const response = await fetch(`${API_URL}/api/reservas/${reserva.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (response.status === 403) {
                                Alert.alert("Error", "No tienes permiso para cancelar esta reserva o tu sesión expiró.");
                                logout();
                                return;
                            }
                            // 204 No Content es el éxito para DELETE
                            if (!response.ok && response.status !== 204) {
                                throw new Error("No se pudo cancelar la reserva.");
                            }

                            // 3. ¡Éxito! Actualizamos el estado local
                            Alert.alert("Éxito", "Reserva cancelada correctamente.");
                            setReservas(prev => prev.filter((r) => r.id !== reserva.id));

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

    return (
        <ScrollView
            style={[styles.page, { height: "100vh" } as any]}
            contentContainerStyle={{
                paddingBottom: 40,
                alignItems: 'center'
            }}
        >
            {/* HEADER */}
            <View style={styles.header}>
                {/* ... (Tu header queda igual) ... */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/logoTerminado.png")}
                        style={styles.logo}
                    /><Text style={styles.brandName}>OpenLodge</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuAnfitrion")}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => navigation.navigate("MenuMiCuentaA")}
                    >
                        <Text style={[styles.buttonText]}>Mi Cuenta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.activeButton]}
                    >
                        <Text style={[styles.buttonText, styles.activeText]}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuPublicar")}
                    >
                        <Text style={styles.buttonText}>Publicar propiedad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Reservas confirmadas:</Text>
                {loading && <ActivityIndicator size="large" color="#4caf50" />}
                {error && <Text style={styles.emptyText}>Error: {error}</Text>}

                {!loading && !error && reservas.length === 0 ? (
                    <Text style={styles.emptyText}>No hay reservas confirmadas.</Text>
                ) : (
                    <FlatList
                        data={reservas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.solicitud}>
                                {/* 7. ¡Datos de la API! */}
                                <Text style={styles.propiedad}>{item.propiedad.titulo}</Text>
                                <Text style={styles.text}>Huésped: {item.huesped.nombre} {item.huesped.apellido}</Text>
                                <Text style={styles.text}>
                                    Desde: {item.fechaInicio} - Hasta: {item.fechaFin}
                                </Text>
                                <Text style={styles.text}>Notas: {item.notas || "Ninguna"}</Text>
                                <Text style={styles.text}>Total Pagado: ${item.precioTotal.toLocaleString()}</Text>

                                <View style={styles.acciones}>
                                    <TouchableOpacity style={styles.btnCancelar} onPress={() => cancelarReserva(item)}>
                                        <Text style={styles.btnText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </ScrollView>
    );
};
