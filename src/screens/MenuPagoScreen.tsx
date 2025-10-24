import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/StackNavigation";
import { styles } from "./styles/MenuPagoStyles";

type MenuPagoNavigationProp = StackNavigationProp<RootStackParamList, "MenuPago">;
type MenuPagoRouteProp = RouteProp<RootStackParamList, "MenuPago">;

interface Props {
  navigation: MenuPagoNavigationProp;
  route: MenuPagoRouteProp;
}

export const MenuPagoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reserva } = route.params; // Recibe la reserva desde la pantalla anterior
  const [medioPago, setMedioPago] = useState<string | null>(null);

  const handlePago = () => {
    if (!medioPago) {
      Alert.alert("Error", "Seleccione un medio de pago para continuar.");
      return;
    }

    Alert.alert(
      "Confirmar pago",
      `¿Desea realizar el pago mediante ${medioPago}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            console.log("Pago confirmado:", {
              reserva,
              medioPago,
            });
            Alert.alert("Éxito", "El pago se ha realizado correctamente.");
            navigation.navigate("MenuHuesped");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logoTerminado.png")} style={styles.logo} />
          <Text style={styles.brandName}>OpenLodge</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MenuHuesped")}
          >
            <Text style={styles.buttonText}>Menú principal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Mi Cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detalle */}
      <View style={styles.detail}>
        <Text style={styles.title}>Dirección de la propiedad seleccionada</Text>

        {/* Imagen */}
        <View style={styles.imageLarge}>
          <TouchableOpacity style={[styles.navBtn, { left: 15 }]}>
            <Text style={styles.navBtnText}>‹</Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/propiedades/1/IMG1.jpg")} // o reserva.propiedadId dinámico
            style={styles.propertyImage}
          />

          <TouchableOpacity style={[styles.navBtn, { right: 15 }]}>
            <Text style={styles.navBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Selección de medio de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Seleccione el medio de pago a utilizar para abonar la reserva:
          </Text>

          <View style={styles.radioGroup}>
            {["Efectivo", "Transferencia bancaria", "Tarjeta de crédito/débito"].map(
              (opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={styles.radioOption}
                  onPress={() => setMedioPago(opcion)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      medioPago === opcion && styles.radioCircleSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>{opcion}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handlePago}>
            <Text style={styles.btnText}>Realizar pago</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnGhost}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnGhostText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuPagoScreen;
