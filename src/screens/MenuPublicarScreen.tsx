import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { styles } from "./styles/MenuPublicarStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { Propiedad, Servicio } from "../types/Propiedad";

type MenuPublicarNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuPublicar"
>;

const API_URL = 'http://172.20.10.2:8080';

export const MenuPublicarScreen: React.FC = () => {
    const navigation = useNavigation<MenuPublicarNavigationProp>();
    const { token, logout } = useAuth();

    const [titulo, setTitulo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precioPorNoche, setPrecioPorNoche] = useState("");
    const [numeroHuespedes, setNumeroHuespedes] = useState("");

    const [serviciosMaestros, setServiciosMaestros] = useState<Servicio[]>([]);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Record<number, boolean>>({});

    const [loading, setLoading] = useState(false);
    const [loadingServicios, setLoadingServicios] = useState(true);

    // Cargar la lista de servicios
    useEffect(() => {
        const cargarServicios = async () => {
            try {
                const response = await fetch(`${API_URL}/api/servicios`);
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los servicios');
                }
                const data: Servicio[] = await response.json();
                setServiciosMaestros(data);
            } catch (error: any) {
                Alert.alert('Error', error.message || 'Error de red');
            } finally {
                setLoadingServicios(false);
            }
        };
        cargarServicios();
    }, []);

    // Función para manejar la selección de un servicio (checkbox/chip)
    const toggleServicio = (id: number) => {
        setServiciosSeleccionados(prev => ({
            ...prev,
            [id]: !prev[id], // Invierte el valor (true/false)
        }));
    };

    // Función para manejar el envío
    const handlePublicar = async () => {
        if (!titulo || !direccion || !precioPorNoche || !numeroHuespedes) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }
        if (!token) {
            Alert.alert("Sesión no válida", "No estás autenticado.");
            return;
        }

        setLoading(true);
        try {
            const serviciosParaEnviar = Object.keys(serviciosSeleccionados)
                .filter(id => serviciosSeleccionados[Number(id)])
                .map(id => ({ id: Number(id) }));

            // Crear el objeto de la nueva propiedad
            const nuevaPropiedad = {
                titulo,
                descripcion,
                direccion,
                precioPorNoche: parseFloat(precioPorNoche),
                numeroHuespedes: parseInt(numeroHuespedes),
                servicios: serviciosParaEnviar,
            };

            // Llamar a la API
            const response = await fetch(`${API_URL}/api/propiedades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ¡Enviamos el token!
                },
                body: JSON.stringify(nuevaPropiedad),
            });

            if (response.status === 403) {
                Alert.alert("Sesión expirada", "Inicia sesión de nuevo.");
                logout();
                return;
            }
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'No se pudo publicar la propiedad.');
            }

            Alert.alert("Éxito", "Propiedad publicada con éxito.");
            navigation.navigate("MenuAnfitrion");

        } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo guardar la propiedad.");
        } finally {
            setLoading(false);
        }
    };

    const cancelar = () => {
        Alert.alert(
            "Cancelar",
            "¿Deseas descartar los cambios?",
            [
                { text: "No", style: "cancel" },
                {
                    text: "Sí",
                    style: "destructive",
                    onPress: () => navigation.navigate("MenuAnfitrion")
                }
            ]
        );
    };

    return (
        <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HEADER */}
            <View style={styles.header}>
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
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuGestionar")}
                    >
                        <Text style={styles.buttonText}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.activeButton]}
                    >
                        <Text style={[styles.buttonText, styles.activeText]}>Publicar propiedad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* FORM */}
            <View style={styles.form}>
                <Text style={styles.label}>Título de la Publicación:</Text>
                <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Ej: Hermosa casa de campo con pileta"
                />
                <Text style={styles.label}>Dirección de la propiedad:</Text>
                <TextInput
                    style={styles.input}
                    value={direccion}
                    onChangeText={setDireccion}
                    placeholder="Ej: Av. Santa Fe 1234"
                />
                <Text style={styles.label}>Precio por Noche (ARS):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={precioPorNoche}
                    onChangeText={setPrecioPorNoche}
                    placeholder="Ej: 50000"
                />
                <Text style={styles.label}>Cantidad de huéspedes:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={numeroHuespedes}
                    onChangeText={setNumeroHuespedes}
                    placeholder="Ej: 4"
                />
                {/* SERVICIOS */}
                <Text style={styles.label}>Servicios incluidos:</Text>
                {loadingServicios ? (
                    <ActivityIndicator color="#4caf50" />
                ) : (
                    <View style={styles.servicios}>
                        {serviciosMaestros.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                style={[
                                    styles.servicioBtn,
                                    serviciosSeleccionados[s.id] && styles.servicioBtnActive,
                                ]}
                                onPress={() => toggleServicio(s.id)}
                            >
                                <Text
                                    style={[
                                        styles.servicioText,
                                        serviciosSeleccionados[s.id] && styles.servicioTextActive,
                                    ]}
                                >
                                    {s.nombre}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    multiline
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Describe tu propiedad (ej: 2 habitaciones, 1 baño...)"
                />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handlePublicar} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Finalizar Publicación</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnDanger} onPress={cancelar} disabled={loading}>
                        <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default MenuPublicarScreen;