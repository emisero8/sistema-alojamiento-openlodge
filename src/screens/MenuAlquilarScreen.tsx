import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/StackNavigation";
import { styles } from "./styles/MenuAlquilarStyles";
import { Propiedad, Servicio } from "../types/Propiedad";
import { useAuth } from "../context/AuthContext";

type MenuAlquilarNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuAlquilar"
>;
type MenuAlquilarRouteProp = RouteProp<RootStackParamList, "MenuAlquilar">;

interface Props {
  navigation: MenuAlquilarNavigationProp;
  route: MenuAlquilarRouteProp;
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

export const MenuAlquilarScreen: React.FC<Props> = ({ navigation, route }) => {
  const { propiedad }: { propiedad: Propiedad } = route.params;


  const imagenesPropiedad = propiedad.imagenPrincipalUrl ? (imagenes[propiedad.imagenPrincipalUrl] || []) : [];
  const [imagenActual, setImagenActual] = useState(0);

  const { logout } = useAuth();

  const [fechaIngreso, setFechaIngreso] = useState<Date | null>(null);
  const [fechaEgreso, setFechaEgreso] = useState<Date | null>(null);
  const [notas, setNotas] = useState("");

  const [mostrarPickerIngreso, setMostrarPickerIngreso] = useState(false);
  const [mostrarPickerEgreso, setMostrarPickerEgreso] = useState(false);

  // fix p/que cuando llamo desde Web anden las alertas
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Seleccionar";
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const validarYContinuar = () => {
    if (!fechaIngreso || !fechaEgreso) {
      return showAlert("Error", "Debe seleccionar ambas fechas");
    }
    if (fechaEgreso <= fechaIngreso) {
      return showAlert("Error", "La fecha de egreso debe ser posterior a la de ingreso");
    }

    // Calculamos los días
    const noches = Math.round(
      (fechaEgreso.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (noches <= 0) {
      return showAlert("Error", "Debe reservar al menos 1 noche");
    }

    // 9. Creamos el objeto 'ReservaParcial' para enviar a la pantalla de Pago
    const reservaParcial = {
      propiedadId: propiedad.id,
      fechaInicio: fechaIngreso.toISOString().split("T")[0], // Formato "YYYY-MM-DD"
      fechaFin: fechaEgreso.toISOString().split("T")[0],     // Formato "YYYY-MM-DD"
      notas: notas,
      // Pasamos la propiedad completa para que la pantalla de pago pueda calcular el precio
      propiedadCompleta: propiedad
    };

    // 10. Navegamos a 'MenuPago' con los datos
    // @ts-ignore (Ignoramos el error de tipo si 'reserva' en tu stack espera 'any')
    navigation.navigate("MenuPago", { reserva: reservaParcial });
  };



  return (
    <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logoTerminado.png")} style={styles.logo} />
          <Text style={styles.brandName}>OpenLodge</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MenuHuesped")}>
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

      {/* DETALLE */}
      <View style={styles.detail}>
        <Text style={styles.title}>{propiedad.titulo}</Text>

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

        {/* CONTENIDO */}
        <View style={styles.columns}>
          {/* Servicios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Servicios incluidos (se cobrará por todos):</Text>
            {propiedad.servicios?.length ? (
              propiedad.servicios.map((s: Servicio) => (
                <View key={s.id} style={styles.checkboxRow}>
                  <View style={[styles.checkbox, styles.checkboxChecked]} />
                  <Text>{s.nombre} (+${s.costo})</Text>
                </View>
              ))
            ) : (
              <Text>No hay servicios disponibles.</Text>
            )}
          </View>

          {/* Datos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complete los siguientes campos:</Text>

            <Text style={styles.sectionTitle}>
              Capacidad: {propiedad.numeroHuespedes} huéspedes.
            </Text>

            {/* Fecha ingreso */}
            {Platform.OS === "web" ? (
              <View style={{ marginTop: 8 }}>
                <Text>Fecha de ingreso:</Text>
                <input
                  type="date"
                  value={fechaIngreso ? fechaIngreso.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setFechaIngreso(d);
                    if (fechaEgreso && d > fechaEgreso) setFechaEgreso(null);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    marginTop: 4,
                  }}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={() => setMostrarPickerIngreso(true)}>
                  <Text>Fecha de ingreso: {formatDate(fechaIngreso)}</Text>
                </TouchableOpacity>
                {mostrarPickerIngreso && (
                  <DateTimePicker
                    value={fechaIngreso || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setMostrarPickerIngreso(false);
                      if (selectedDate) setFechaIngreso(selectedDate);
                    }}
                  />
                )}
              </>
            )}

            {/* Fecha egreso */}
            {Platform.OS === "web" ? (
              <View style={{ marginTop: 8 }}>
                <Text>Fecha de egreso:</Text>
                <input
                  type="date"
                  value={fechaEgreso ? fechaEgreso.toISOString().split("T")[0] : ""}
                  min={fechaIngreso ? fechaIngreso.toISOString().split("T")[0] : undefined}
                  onChange={(e) => setFechaEgreso(new Date(e.target.value))}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    marginTop: 4,
                  }}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity onPress={() => setMostrarPickerEgreso(true)}>
                  <Text>Fecha de egreso: {formatDate(fechaEgreso)}</Text>
                </TouchableOpacity>
                {mostrarPickerEgreso && (
                  <DateTimePicker
                    value={fechaEgreso || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setMostrarPickerEgreso(false);
                      if (selectedDate) setFechaEgreso(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          </View>

          {/* Notas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas al locador:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Escriba aquí..."
              value={notas}
              onChangeText={setNotas}
              multiline
            />
          </View>
        </View>

        {/* Botones */}
        <View style={[styles.buttons, { marginBottom: 20 }]}>
          <TouchableOpacity style={styles.btnPrimary} onPress={validarYContinuar}>
            <Text style={styles.btnText}>Continuar al Pago</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.goBack()}>
            <Text style={styles.btnGhostText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuAlquilarScreen;
