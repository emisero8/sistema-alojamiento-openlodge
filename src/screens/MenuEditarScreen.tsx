import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet, // Usaremos un StyleSheet
} from "react-native";
import { styles } from "./styles/MenuEditarStyles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";

import { useAuth } from "../context/AuthContext";
import { Propiedad, Servicio } from "../types/Propiedad";

// Define la URL de la API
const API_URL = 'http://172.20.10.2:8080';

// Define el tipo de los parámetros de la ruta
type MenuEditarRouteProp = RouteProp<RootStackParamList, 'MenuEditar'>;

export const MenuEditarScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<MenuEditarRouteProp>(); // 1. Obtenemos la ruta para acceder a los parámetros
    const { token, logout } = useAuth(); // 2. Obtenemos el token

    // 3. Obtenemos la propiedad que enviamos desde MenuAnfitrionScreen
    const propiedadAEditar = route.params.propiedad;

    // 4. Estados del formulario, inicializados con los datos de la propiedad
    const [titulo, setTitulo] = useState(propiedadAEditar.titulo);
    const [direccion, setDireccion] = useState(propiedadAEditar.direccion);
    const [descripcion, setDescripcion] = useState(propiedadAEditar.descripcion);
    const [precioPorNoche, setPrecioPorNoche] = useState(propiedadAEditar.precioPorNoche.toString());
    const [numeroHuespedes, setNumeroHuespedes] = useState(propiedadAEditar.numeroHuespedes.toString());
    const [imagenPrincipalUrl, setImagenPrincipalUrl] = useState(propiedadAEditar.imagenPrincipalUrl);

    // 5. Estados para cargar y seleccionar servicios
    const [serviciosMaestros, setServiciosMaestros] = useState<Servicio[]>([]);

    // Convertimos el array de servicios de la propiedad (ej: [ {id: 1}, {id: 3} ])
    // en un mapa de selección (ej: { 1: true, 3: true })
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<Record<number, boolean>>(() => {
        const initialState: Record<number, boolean> = {};
        propiedadAEditar.servicios.forEach(s => {
            initialState[s.id] = true;
        });
        return initialState;
    });

    const [loading, setLoading] = useState(false); // Para guardar
    const [loadingServicios, setLoadingServicios] = useState(true); // Para cargar los chips

    // 6. Cargar la lista de servicios maestros al montar la pantalla
    useEffect(() => {
        const cargarServicios = async () => {
            setLoadingServicios(true);
            try {
                const response = await fetch(`${API_URL}/api/servicios`);
                if (!response.ok) throw new Error('No se pudieron cargar los servicios');
                const data: Servicio[] = await response.json();
                setServiciosMaestros(data);
            } catch (error: any) {
                Alert.alert('Error', error.message);
            } finally {
                setLoadingServicios(false);
            }
        };
        cargarServicios();
    }, []); // Se ejecuta solo una vez

    // 7. Función para manejar la selección de un servicio (checkbox)
    const toggleServicio = (id: number) => {
        setServiciosSeleccionados(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // 8. Función para guardar los cambios (reemplaza tu guardarCambios)
    const handleGuardarCambios = async () => {
        if (!titulo || !direccion || !precioPorNoche || !numeroHuespedes) {
            Alert.alert("Error", "Por favor completa todos los campos requeridos.");
            return;
        }
        if (!token) {
            Alert.alert("Error", "No estás autenticado.");
            return;
        }

        setLoading(true);
        try {
            // Formatear los servicios al formato de la API: [ { "id": 1 }, { "id": 3 } ]
            const serviciosParaEnviar = Object.keys(serviciosSeleccionados)
                .filter(id => serviciosSeleccionados[Number(id)])
                .map(id => ({ id: Number(id) }));

            // Crear el objeto de la propiedad actualizada
            const propiedadActualizada = {
                titulo,
                descripcion,
                direccion,
                precioPorNoche: parseFloat(precioPorNoche),
                numeroHuespedes: parseInt(numeroHuespedes),
                imagenPrincipalUrl: imagenPrincipalUrl || '/img/propiedades/default.png',
                servicios: serviciosParaEnviar,
            };

            // Llamar a la API con el método PUT
            const response = await fetch(`${API_URL}/api/propiedades/${propiedadAEditar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(propiedadActualizada),
            });

            if (response.status === 403) {
                Alert.alert("Error", "No tienes permiso para editar esta propiedad o tu sesión expiró.");
                logout();
                return;
            }
            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'No se pudo guardar la propiedad.');
            }

            Alert.alert("✅ Éxito", "Propiedad actualizada con éxito.");
            navigation.navigate("MenuAnfitrion"); // Volvemos al menú

        } catch (error: any) {
            Alert.alert("Error", error.message || "No se pudo guardar la propiedad.");
        } finally {
            setLoading(false);
        }
    };

    const cancelar = () => {
        // Usamos Alert.alert nativo
        Alert.alert(
            "Cancelar Cambios",
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
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/logoTerminado.png")} style={styles.logo}
                    /><Text style={styles.brandName}>OpenLodge</Text>
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* FORMULARIO */}
            <View style={styles.form}>
                <Text style={styles.label}>Título de la Publicación:</Text>
                <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                />

                <Text style={styles.label}>Dirección:</Text>
                <TextInput
                    style={styles.input}
                    value={direccion}
                    onChangeText={setDireccion}
                />

                {/* IMAGEN */}
                <Text style={styles.label}>URL de Imagen Principal:</Text>
                <TextInput
                    style={styles.input}
                    value={imagenPrincipalUrl}
                    onChangeText={setImagenPrincipalUrl}
                />

                {/* SERVICIOS (Cargados desde la API) */}
                <Text style={styles.label}>Servicios incluidos:</Text>
                {loadingServicios ? (
                    <ActivityIndicator color="#4caf50" />
                ) : (
                    <View style={styles.servicios}>
                        {serviciosMaestros.map((s) => (
                            <TouchableOpacity
                                key={s.id}
                                style={[
                                    styles.servicioItem,
                                    serviciosSeleccionados[s.id] && styles.servicioActivo,
                                ]}
                                onPress={() => toggleServicio(s.id)}
                            >
                                <Text
                                    style={[
                                        styles.servicioText,
                                        serviciosSeleccionados[s.id] && styles.servicioTextActivo,
                                    ]}
                                >
                                    {s.nombre}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Cantidad de huéspedes:</Text>
                <TextInput
                    style={styles.input}
                    value={numeroHuespedes}
                    onChangeText={setNumeroHuespedes}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                    multiline
                    value={descripcion}
                    onChangeText={setDescripcion}
                />

                <View style={styles.acciones}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleGuardarCambios} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Guardar cambios</Text>
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

export default MenuEditarScreen;