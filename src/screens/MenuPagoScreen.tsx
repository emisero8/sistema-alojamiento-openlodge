import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Platform } from "react-native";
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

// 📸 Mapa de imágenes
const imagenes: Record<string, any[]> = {
  "1": [
    require("../assets/propiedades/1/IMG1.jpg"),
    require("../assets/propiedades/1/IMG2.jpg"),
    require("../assets/propiedades/1/IMG3.jpg"),
  ],
  "2": [
    require("../assets/propiedades/2/IMG1.jpg"),
    require("../assets/propiedades/2/IMG2.jpg"),
    require("../assets/propiedades/2/IMG3.jpg"),
  ],
  "3": [
    require("../assets/propiedades/3/IMG1.jpg"),
    require("../assets/propiedades/3/IMG2.jpg"),
    require("../assets/propiedades/3/IMG3.jpg"),
  ],
  "4": [
    require("../assets/propiedades/4/IMG1.jpg"),
    require("../assets/propiedades/4/IMG2.jpg"),
    require("../assets/propiedades/4/IMG3.jpg"),
  ],
  "5": [
    require("../assets/propiedades/5/IMG1.jpg"),
    require("../assets/propiedades/5/IMG2.jpg"),
    require("../assets/propiedades/5/IMG3.jpg"),
  ],
  "6": [
    require("../assets/propiedades/6/IMG1.jpg"),
    require("../assets/propiedades/6/IMG2.jpg"),
    require("../assets/propiedades/6/IMG3.jpg"),
  ],
  "7": [
    require("../assets/propiedades/7/IMG1.jpg"),
    require("../assets/propiedades/7/IMG2.jpg"),
    require("../assets/propiedades/7/IMG3.jpg"),
  ],
  "8": [
    require("../assets/propiedades/8/IMG1.jpg"),
    require("../assets/propiedades/8/IMG2.jpg"),
    require("../assets/propiedades/8/IMG3.jpg"),
  ],
  "9": [
    require("../assets/propiedades/9/IMG1.jpg"),
    require("../assets/propiedades/9/IMG2.jpg"),
    require("../assets/propiedades/9/IMG3.jpg"),
  ],
};
export const MenuPagoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reserva } = route.params; // Recibe la reserva desde la pantalla anterior
  const imagenesPropiedad = imagenes[String(reserva.propiedadId)] || []; //desactivo esta por la de abajo que maneja error de fallo de ID
  //const imagenesPropiedad =
  //  imagenes[String(reserva.propiedadId)] && imagenes[String(reserva.propiedadId)].length > 0
  //    ? imagenes[String(reserva.propiedadId)]
  //    : [require("../assets/no-image.png")]; // imagen por defecto

  const [imagenActual, setImagenActual] = useState(0);
  const [medioPago, setMedioPago] = useState<string | null>(null);

  // fix p/que cuando llamo desde Web anden las alertas
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handlePago = () => {
    console.log("✅ manejarPago ejecutada");
    if (!medioPago) {
      //Alert.alert("Error", "Seleccione un medio de pago para continuar.");
      //return;
      return showAlert("Error", "Seleccione un medio de pago para continuar.");
    }

    if (Platform.OS === "web") {
      const confirmar = window.confirm(
        `¿Desea realizar el pago mediante ${medioPago}?`
      );
      if (confirmar) {
        console.log("Pago confirmado:", {reserva, medioPago,});
        showAlert("Éxito", "El pago se ha realizado correctamente");
        navigation.navigate("MenuHuesped");
      }
    } else {
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
    }
  };

  const [costos, setCostos] = useState<{
    noches: number;
    costoAlojamiento: number;
    costoServiciosTotal: number;
    detalleServicios: { nombre: string; precio: number }[];
    total: number;
  } | null>(null);

  useEffect(() => {
    try {
      const propiedadesData = require("../data/propiedades.json");
      const costoServiciosData = require("../data/costoServicios.json");

      const propiedad = propiedadesData.find(
        (p: any) => String(p.id) === String(reserva.propiedadId)
      );
      if (!propiedad) return;

      const ingreso = new Date(reserva.fechaIngreso);
      const egreso = new Date(reserva.fechaEgreso);
      const noches = Math.round(
        (egreso.getTime() - ingreso.getTime()) / (1000 * 60 * 60 * 24)
      );
      const costoAlojamiento = noches * propiedad.price;

      let costoServiciosTotal = 0;
      const detalleServicios: { nombre: string; precio: number }[] = [];

      if (reserva.servicios && reserva.servicios.length > 0) {
        reserva.servicios.forEach((servicio: string) => {
          const key = Object.keys(costoServiciosData).find(
            (k) => k.trim().toLowerCase() === servicio.trim().toLowerCase()
          );
          if (key) {
            const precio = costoServiciosData[key];
            costoServiciosTotal += precio;
            detalleServicios.push({ nombre: key, precio });
          }
        });
      }

      const total = costoAlojamiento + costoServiciosTotal;
      setCostos({ noches, costoAlojamiento, costoServiciosTotal, detalleServicios, total });
    } catch (error) {
      console.error("Error calculando costos:", error);
    }
  }, [reserva]);

  return (
    <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
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

        {/* Carrusel */}
        {imagenesPropiedad.length > 0 && (
          <View style={styles.carousel}>
            <TouchableOpacity
              onPress={() => setImagenActual((prev) => (prev - 1 + imagenesPropiedad.length) % imagenesPropiedad.length)}
              style={styles.navBtn}
            >
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>

            <Image source={imagenesPropiedad[imagenActual]} style={styles.imageLarge} resizeMode="cover" />

            <TouchableOpacity
              onPress={() => setImagenActual((prev) => (prev + 1) % imagenesPropiedad.length)}
              style={[styles.navBtn, { right: 10 }]}
            >
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.resumenContainer}>
          <View style={styles.resumenBox}>
            {/* --- Resumen de la reserva --- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resumen de la reserva</Text>
              <Text>Cantidad de inquilinos: {reserva.cantidadInquilinos}</Text>
              <Text>Fecha de ingreso: {reserva.fechaIngreso}</Text>
              <Text>Fecha de egreso: {reserva.fechaEgreso}</Text>
              <Text>Notas al locador: {reserva.notas || "Ninguna"}</Text>
              <Text style={{ marginTop: 6, fontWeight: "600" }}>Servicios seleccionados:</Text>
              {reserva.servicios && reserva.servicios.length > 0 ? (
                reserva.servicios.map((s: string, i: number) => <Text key={i}>• {s}</Text>)
              ) : (
                <Text>Ninguno</Text>
              )}
            </View>
          </View>
          <View style={styles.resumenBox}>
            {/* --- Resumen de costos --- */}
            {costos && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen de costos</Text>
                <Text>
                  Noches: {costos.noches} × ${costos.costoAlojamiento / costos.noches} = $
                  {costos.costoAlojamiento}
                </Text>
                <Text>Servicios: ${costos.costoServiciosTotal}</Text>
                {costos.detalleServicios.length > 0 && (
                  <View style={{ marginLeft: 10 }}>
                    {costos.detalleServicios.map((s, i) => (
                      <Text key={i}>• {s.nombre}: ${s.precio}</Text>
                    ))}
                  </View>
                )}
                <Text style={{ marginTop: 6, fontWeight: "bold" }}>
                  Total a pagar: ${costos.total}
                </Text>
              </View>
            )}
          </View>
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
