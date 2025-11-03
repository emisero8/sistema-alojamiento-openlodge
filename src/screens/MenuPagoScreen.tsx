import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ScrollView, Platform, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/StackNavigation";
import { styles } from "./styles/MenuPagoStyles";
import { Propiedad, Servicio } from "../types/Propiedad";
import { useAuth } from "../context/AuthContext";

type MenuPagoNavigationProp = StackNavigationProp<RootStackParamList, "MenuPago">;
type MenuPagoRouteProp = RouteProp<RootStackParamList, "MenuPago">;

interface Props {
  navigation: MenuPagoNavigationProp;
  route: MenuPagoRouteProp;
}

const API_URL = "http://192.168.0.5:8080";

interface ReservaParcial {
  propiedadId: number;
  fechaInicio: string; // "YYYY-MM-DD"
  fechaFin: string;    // "YYYY-MM-DD"
  notas: string;
  propiedadCompleta: Propiedad; // La propiedad para calcular costos
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

export const MenuPagoScreen: React.FC<Props> = ({ navigation, route }) => {
  // @ts-ignore (Ignoramos el tipo 'any' de la navegación)
  const { reserva }: { reserva: ReservaParcial } = route.params;
  const { propiedadCompleta } = reserva;

  const { token, logout } = useAuth();

  const imagenesPropiedad = propiedadCompleta.imagenPrincipalUrl ? (imagenes[propiedadCompleta.imagenPrincipalUrl] || []) : [];
  const [imagenActual, setImagenActual] = useState(0);

  const [medioPago, setMedioPago] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Para el botón de pago
  const [costos, setCostos] = useState<{
    noches: number;
    costoAlojamiento: number;
    costoServiciosTotal: number;
    total: number;
  } | null>(null);

  // fix p/que cuando llamo desde Web anden las alertas
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Lógica de Cálculo de Costos
  useEffect(() => {
    try {
      const ingreso = new Date(reserva.fechaInicio);
      const egreso = new Date(reserva.fechaFin);

      // Sumamos 1 día al egreso para el cálculo (ej: 10-Nov a 11-Nov es 1 noche)
      egreso.setDate(egreso.getDate() + 1);

      const noches = Math.round(
        (egreso.getTime() - ingreso.getTime()) / (1000 * 60 * 60 * 24)
      );

      const costoAlojamiento = noches * propiedadCompleta.precioPorNoche;

      // Los servicios ahora son objetos
      let costoServiciosTotal = 0;
      if (propiedadCompleta.servicios && propiedadCompleta.servicios.length > 0) {
        propiedadCompleta.servicios.forEach((servicio: Servicio) => {
          costoServiciosTotal += servicio.costo;
        });
      }

      const total = costoAlojamiento + costoServiciosTotal;
      setCostos({ noches, costoAlojamiento, costoServiciosTotal, total });

    } catch (error) {
      console.error("Error calculando costos:", error);
      showAlert("Error", "No se pudo calcular el costo de la reserva.");
    }
  }, [reserva]); // Se recalcula si la reserva cambia

  // Función de Pago
  const handlePago = async () => {
    if (!medioPago) {
      return showAlert("Error", "Seleccione un medio de pago para continuar.");
    }
    if (!costos || !token) {
      return showAlert("Error", "No se pudo calcular el costo o no estás autenticado.");
    }

    // 8. Creamos el objeto 'ReservaRequest' que espera el backend
    const reservaParaAPI = {
      propiedadId: reserva.propiedadId,
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      precioTotal: costos.total, // El precio que calculamos
      notas: reserva.notas,
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ¡Enviamos el token!
        },
        body: JSON.stringify(reservaParaAPI),
      });

      if (response.status === 409) { // 409 Conflict
        const errorMessage = await response.text();
        showAlert("Reserva Fallida", errorMessage || "Las fechas seleccionadas ya no están disponibles.");
        // Opcional: navegar de vuelta a la pantalla anterior
        // navigation.goBack();
        return; // No continuar
      }

      if (response.status === 403) {
        Alert.alert("Error de permisos", "Solo los huéspedes pueden crear reservas. O tu sesión expiró.");
        logout();
        return;
      }
      if (!response.ok) {
        throw new Error("No se pudo confirmar la reserva.");
      }

      showAlert("Éxito", "¡Reserva confirmada con éxito!");
      navigation.navigate("MenuHuesped");

    } catch (error: any) {
      console.error("Error al pagar:", error);
      showAlert("Error", error.message || "No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logoTerminado.png")} style={styles.logo}
          /><Text style={styles.brandName}>OpenLodge</Text>
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
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detalle */}
      <View style={styles.detail}>
        <Text style={styles.title}>{propiedadCompleta.titulo}</Text>

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
              <Text>Cantidad de inquilinos: {propiedadCompleta.numeroHuespedes}</Text>
              <Text>Fecha de ingreso: {reserva.fechaInicio}</Text>
              <Text>Fecha de egreso: {reserva.fechaFin}</Text>
              <Text>Notas al locador: {reserva.notas || "Ninguna"}</Text>

              <Text style={{ marginTop: 6, fontWeight: "600" }}>Servicios incluidos:</Text>
              {propiedadCompleta.servicios && propiedadCompleta.servicios.length > 0 ? (
                propiedadCompleta.servicios.map((s: Servicio) =>
                  <Text key={s.id}>• {s.nombre}</Text>
                )
              ) : (
                <Text>Ninguno</Text>
              )}
            </View>
          </View>

          <View style={styles.resumenBox}>
            {/* --- Resumen de costos --- */}
            {costos ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen de costos</Text>
                <Text>
                  Noches: {costos.noches} × ${propiedadCompleta.precioPorNoche} = $
                  {costos.costoAlojamiento}
                </Text>
                <Text>Costo Servicios: ${costos.costoServiciosTotal}</Text>
                {/* (Detalle de servicios eliminado por simplicidad) */}
                <Text style={{ marginTop: 6, fontWeight: "bold" }}>
                  Total a pagar: ${costos.total}
                </Text>
              </View>
            ) : (
              <ActivityIndicator />
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
          <TouchableOpacity style={styles.btnPrimary} onPress={handlePago} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Realizar pago</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnGhost}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.btnGhostText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuPagoScreen;
