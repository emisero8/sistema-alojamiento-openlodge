import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles/MenuGestionarStyles";

interface Reserva {
    propiedad: string;
    huesped: string;
    fechaEntrada: string;
    fechaSalida: string;
    personas: number;
}

export const MenuGestionarScreen: React.FC = () => {
    const navigation = useNavigation();
    const [reservas, setReservas] = useState<Reserva[]>([]);

    useEffect(() => {
        const cargarReservas = async () => {
            const guardadas = await AsyncStorage.getItem("solicitudesReserva");
            if (guardadas) {
                setReservas(JSON.parse(guardadas));
            } else {
                const ejemplo: Reserva[] = [
                    {
                        propiedad: "General Lopez 3234, General Alvear, Santa Fe",
                        huesped: "Juan Pérez",
                        fechaEntrada: "2025-10-05",
                        fechaSalida: "2025-10-10",
                        personas: 2,
                    },
                    {
                        propiedad: "Pedro Vittori 3658, Costanera Oeste, Santa Fe",
                        huesped: "María Gómez",
                        fechaEntrada: "2025-11-01",
                        fechaSalida: "2025-11-07",
                        personas: 4,
                    },
                ];
                setReservas(ejemplo);
                await AsyncStorage.setItem("solicitudesReserva", JSON.stringify(ejemplo));
            }
        };
        cargarReservas();
    }, []);

    const aceptarReserva = async (index: number) => {
        Alert.alert("✅ Reserva aceptada", reservas[index].propiedad);
        const nuevas = reservas.filter((_, i) => i !== index);
        setReservas(nuevas);
        await AsyncStorage.setItem("solicitudesReserva", JSON.stringify(nuevas));
    };

    const cancelarReserva = async (index: number) => {
        Alert.alert("❌ Reserva cancelada", reservas[index].propiedad);
        const nuevas = reservas.filter((_, i) => i !== index);
        setReservas(nuevas);
        await AsyncStorage.setItem("solicitudesReserva", JSON.stringify(nuevas));
    };

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.brand}>OpenLodge</Text>
                <View style={styles.topControls}>
                    <TouchableOpacity onPress={() => navigation.navigate("MenuAnfitrion" as never)} style={styles.btnNav}>
                        <Text style={styles.btnText}>Menú principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("MenuHistorial" as never)} style={styles.btnNav}>
                        <Text style={styles.btnText}>Historial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnNav, styles.btnActive]}>
                        <Text style={[styles.btnText, styles.textActive]}>Gestionar reservas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("MenuPublicar" as never)} style={styles.btnNav}>
                        <Text style={styles.btnText}>Publicar propiedad</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.container}>
                <Text style={styles.title}>Nuevas solicitudes de reserva:</Text>

                {reservas.length === 0 ? (
                    <Text style={styles.emptyText}>No hay nuevas solicitudes.</Text>
                ) : (
                    <FlatList
                        data={reservas}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.solicitud}>
                                <Text style={styles.propiedad}>{item.propiedad}</Text>
                                <Text style={styles.text}>Huésped: {item.huesped}</Text>
                                <Text style={styles.text}>
                                    Desde: {item.fechaEntrada} - Hasta: {item.fechaSalida}
                                </Text>
                                <Text style={styles.text}>Personas: {item.personas}</Text>
                                <View style={styles.acciones}>
                                    <TouchableOpacity style={styles.btnAceptar} onPress={() => aceptarReserva(index)}>
                                        <Text style={styles.btnText}>Aceptar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnCancelar} onPress={() => cancelarReserva(index)}>
                                        <Text style={styles.btnText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};
