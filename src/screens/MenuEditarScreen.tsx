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
} from "react-native";
import { styles } from "./styles/MenuEditarStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

interface Propiedad {
    id: string;
    title: string;
    img: string;
    details: string[];
    servicios: string[];
    descripcion?: string;
}

type MenuEditarNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuEditar"

>;

export const MenuEditarScreen: React.FC = () => {
    const navigation = useNavigation<MenuEditarNavigationProp>();

    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [direccion, setDireccion] = useState("");
    const [inquilinos, setInquilinos] = useState("");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [servicios, setServicios] = useState<string[]>([]);
    const [imagen, setImagen] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPropiedad = async () => {
            try {
                const idEditar = await AsyncStorage.getItem("propiedadEditar");
                if (!idEditar) {
                    Alert.alert("Error", "No se encontró la propiedad a editar");
                    navigation.navigate("MenuAnfitrion" as never);
                    return;
                }

                const listaStr = await AsyncStorage.getItem("propiedades");
                const lista: Propiedad[] = listaStr ? JSON.parse(listaStr) : [];
                const prop = lista.find((p) => p.id === idEditar);

                if (!prop) {
                    Alert.alert("Error", "Propiedad no encontrada");
                    navigation.navigate("MenuAnfitrion" as never);
                    return;
                }

                setPropiedad(prop);
                setDireccion(prop.title);
                setInquilinos(prop.details[0]?.match(/\d+/)?.[0] || "");
                setDesde(prop.details[1]?.replace("Disponible desde: ", "") || "");
                setHasta(prop.details[2]?.replace("Disponible hasta: ", "") || "");
                setDescripcion(prop.descripcion || "");
                setServicios(prop.servicios || []);
                setImagen(prop.img);
            } catch (err) {
                console.error("Error al cargar propiedad:", err);
            } finally {
                setLoading(false);
            }
        };

        cargarPropiedad();


    }, []);

    const toggleServicio = (s: string) => {
        setServicios((prev) =>
            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
        );
    };

    const seleccionarImagen = async () => {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert("Permiso requerido", "Se necesita acceso a tus imágenes.");
            return;
        }


        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }

    };

    const guardarCambios = async () => {
        if (!direccion || !inquilinos || !desde || !hasta) {
            Alert.alert("Error", "Por favor completa todos los campos requeridos.");
            return;
        }

        try {
            const listaStr = await AsyncStorage.getItem("propiedades");
            const lista: Propiedad[] = listaStr ? JSON.parse(listaStr) : [];

            if (!propiedad) return;

            const actualizada: Propiedad = {
                ...propiedad,
                title: direccion,
                img: imagen || propiedad.img,
                details: [
                    `Capacidad: ${inquilinos} inquilinos`,
                    `Disponible desde: ${desde} `,
                    `Disponible hasta: ${hasta} `,
                ],
                descripcion,
                servicios,
            };

            const nuevas = lista.map((p) => (p.id === propiedad.id ? actualizada : p));
            await AsyncStorage.setItem("propiedades", JSON.stringify(nuevas));
            await AsyncStorage.removeItem("propiedadEditar");

            Alert.alert("Éxito", "Propiedad editada con éxito ✅", [
                { text: "OK", onPress: () => navigation.navigate("MenuAnfitrion" as never) },
            ]);
        } catch (err) {
            console.error("Error guardando cambios:", err);
        }

    };

    const cancelar = () => {
        Alert.alert("Cancelar", "¿Deseas cancelar la edición?", [
            { text: "No", style: "cancel" },
            { text: "Sí", onPress: () => navigation.navigate("MenuAnfitrion" as never) },
        ]);
    };

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}> <ActivityIndicator size="large" color="#4caf50" />
                <Text style={{ marginTop: 10 }}>Cargando propiedad...</Text> </View>
        );
    }

    return (
    <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* HEADER */} <View style={styles.header}> <View style={styles.logoContainer}>
            <Image
                source={require("../assets/logoTerminado.png")}
                style={styles.logo}
            /> <Text style={styles.brandName}>OpenLodge</Text> </View>

            ```
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("MenuAnfitrion" as never)}
                >
                    <Text style={styles.buttonText}>Menú principal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Historial</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Gestionar reservas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Publicar propiedad</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
            <Text style={styles.label}>Dirección de la propiedad:</Text>
            <TextInput
                style={styles.input}
                value={direccion}
                onChangeText={setDireccion}
                placeholder="Ej: Calle 123, Ciudad"
            />

            <Text style={styles.label}>Imágenes de la propiedad:</Text>
            <TouchableOpacity style={styles.preview} onPress={seleccionarImagen}>
                {imagen ? (
                    <Image source={{ uri: imagen }} style={styles.previewImage} />
                ) : (
                    <Text style={styles.previewText}>Tocar para seleccionar imagen</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.label}>Seleccione servicios a incluir:</Text>
            <View style={styles.servicios}>
                {["Wi-Fi", "Cochera", "Piscina", "Aire acondicionado"].map((s) => (
                    <TouchableOpacity
                        key={s}
                        onPress={() => toggleServicio(s)}
                        style={[
                            styles.servicioItem,
                            servicios.includes(s) && styles.servicioActivo,
                        ]}
                    >
                        <Text
                            style={[
                                styles.servicioText,
                                servicios.includes(s) && styles.servicioTextActivo,
                            ]}
                        >
                            {s}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Cantidad de inquilinos:</Text>
            <TextInput
                style={styles.input}
                value={inquilinos}
                onChangeText={setInquilinos}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Disponible desde:</Text>
            <TextInput
                style={styles.input}
                value={desde}
                onChangeText={setDesde}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Disponible hasta:</Text>
            <TextInput
                style={styles.input}
                value={hasta}
                onChangeText={setHasta}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                multiline
                value={descripcion}
                onChangeText={setDescripcion}
            />

            <View style={styles.acciones}>
                <TouchableOpacity style={styles.btnPrimary} onPress={guardarCambios}>
                    <Text style={styles.btnText}>Guardar cambios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDanger} onPress={cancelar}>
                    <Text style={styles.btnText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>

    );
};

export default MenuEditarScreen;
