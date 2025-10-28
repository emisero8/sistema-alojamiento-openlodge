import React, { useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/MenuPublicarStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";

type MenuPublicarNavigationProp = StackNavigationProp<
    RootStackParamList,
    "MenuPublicar"
>;

interface Propiedad {
    id: string;
    title: string;
    img: string;
    details: string[];
    servicios: string[];
    descripcion: string;
}

export const MenuPublicarScreen: React.FC = () => {
    const navigation = useNavigation<MenuPublicarNavigationProp>();

    const [direccion, setDireccion] = useState("");
    const [inquilinos, setInquilinos] = useState("1");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [servicios, setServicios] = useState<string[]>([]);
    const [imagenes, setImagenes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleServicio = (serv: string) => {
        setServicios((prev) =>
            prev.includes(serv) ? prev.filter((s) => s !== serv) : [...prev, serv]
        );
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const uris = result.assets.map((a) => a.uri);
            setImagenes(uris);
        }
    };

    const handleGuardar = async () => {
        if (!direccion || !desde || !hasta) {
            Alert.alert("Error", "Por favor completa los campos obligatorios.");
            return;
        }

        setLoading(true);
        try {
            const nuevaPropiedad: Propiedad = {
                id: Date.now().toString(),
                title: direccion,
                img: imagenes[0] || "",
                details: [
                    `Capacidad: ${inquilinos} inquilinos`,
                    `Disponible desde: ${desde}`,
                    `Disponible hasta: ${hasta}`,
                ],
                servicios,
                descripcion,
            };

            const listaStr = await AsyncStorage.getItem("propiedades");
            const lista = listaStr ? JSON.parse(listaStr) : [];
            lista.push(nuevaPropiedad);
            await AsyncStorage.setItem("propiedades", JSON.stringify(lista));

            Alert.alert("✅ Éxito", "Propiedad publicada con éxito.");
            navigation.navigate("MenuAnfitrion");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la propiedad.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#4caf50" />
                <Text style={{ marginTop: 10 }}>Guardando propiedad...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../assets/logoTerminado.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.brandName}>OpenLodge</Text>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuAnfitrion")}
                    >
                        <Text style={styles.buttonText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuHistorial")}
                    >
                        <Text style={styles.buttonText}>Historial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("MenuGestionar")}
                    >
                        <Text style={styles.buttonText}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.activeButton]}>
                        <Text style={styles.buttonText}>Publicar propiedad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* FORM */}
            <View style={styles.form}>
                <Text style={styles.label}>Dirección de la propiedad:</Text>
                <TextInput
                    style={styles.input}
                    value={direccion}
                    onChangeText={setDireccion}
                    placeholder="Ej: Av. Santa Fe 1234"
                />

                <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
                    <Text style={styles.uploadText}>Seleccionar imágenes</Text>
                </TouchableOpacity>

                <ScrollView horizontal style={styles.previewContainer}>
                    {imagenes.length > 0 ? (
                        imagenes.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={styles.previewImg}
                            />
                        ))
                    ) : (
                        <Text style={styles.previewText}>Sin imágenes seleccionadas</Text>
                    )}
                </ScrollView>

                <Text style={styles.label}>Servicios incluidos:</Text>
                <View style={styles.servicios}>
                    {["Wi-Fi", "Cochera", "Piscina", "Aire acondicionado"].map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.servicioBtn,
                                servicios.includes(s) && styles.servicioBtnActive,
                            ]}
                            onPress={() => toggleServicio(s)}
                        >
                            <Text
                                style={[
                                    styles.servicioText,
                                    servicios.includes(s) && styles.servicioTextActive,
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
                    keyboardType="numeric"
                    value={inquilinos}
                    onChangeText={setInquilinos}
                />

                <Text style={styles.label}>Disponible desde:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={desde}
                    onChangeText={setDesde}
                />

                <Text style={styles.label}>Disponible hasta:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={hasta}
                    onChangeText={setHasta}
                />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    multiline
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Describe tu propiedad..."
                />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleGuardar}>
                        <Text style={styles.btnText}>Finalizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnDanger}
                        onPress={() => navigation.navigate("MenuAnfitrion")}
                    >
                        <Text style={styles.btnText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default MenuPublicarScreen;
