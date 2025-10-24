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

type MenuAlquilarNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuAlquilar"
>;

type MenuAlquilarRouteProp = RouteProp<RootStackParamList, "MenuAlquilar">;

interface Props {
  navigation: MenuAlquilarNavigationProp;
  route: MenuAlquilarRouteProp;
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

export const MenuAlquilarScreen: React.FC<Props> = ({ navigation, route }) => {
  const { propiedad } = route.params;
  const imagenesPropiedad = imagenes[propiedad.id] || [];

  const [imagenActual, setImagenActual] = useState(0);
  const [cantidadInquilinos, setCantidadInquilinos] = useState<number | null>(null);
  const [fechaIngreso, setFechaIngreso] = useState<Date | null>(null);
  const [fechaEgreso, setFechaEgreso] = useState<Date | null>(null);
  const [mostrarPickerIngreso, setMostrarPickerIngreso] = useState(false);
  const [mostrarPickerEgreso, setMostrarPickerEgreso] = useState(false);
  const [notas, setNotas] = useState("");

  // fix p/que cuando llamo desde Web anden las alertas
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const validarYReservar = () => {
    console.log("✅ validarYReservar ejecutada");
    Alert.alert("Debug", "Se ejecutó la función validarYReservar");
    if (!cantidadInquilinos)
      //return Alert.alert("Error", "Seleccione la cantidad de inquilinos");
      return showAlert("Error", "Seleccione la cantidad de inquilinos");
    if (!fechaIngreso || !fechaEgreso)
      //return Alert.alert("Error", "Debe seleccionar fechas");
      return showAlert("Error", "Debe seleccionar fechas");
    if (fechaEgreso <= fechaIngreso)
      //return Alert.alert("Error", "La fecha de egreso debe ser posterior");
      return showAlert("Error", "La fecha de egreso debe ser posterior");

    const reserva = {
      propiedadId: propiedad.id,
      titulo: propiedad.title,
      cantidadInquilinos,
      fechaIngreso: fechaIngreso.toISOString().split("T")[0],
      fechaEgreso: fechaEgreso.toISOString().split("T")[0],
      servicios: propiedad.servicios,
      notas,
    };

    if (Platform.OS === "web") {
      const confirmar = window.confirm(
        `¿Confirmar reserva de ${cantidadInquilinos} inquilinos del ${reserva.fechaIngreso} al ${reserva.fechaEgreso}?`
      );
      if (confirmar) {
        console.log("Reserva confirmada:", reserva);
        showAlert("Éxito", "Reserva confirmada con éxito");
        navigation.navigate("MenuPago", { reserva });
      }
    } else {
      Alert.alert(
        "Confirmar reserva",
        `¿Confirmar reserva de ${cantidadInquilinos} inquilinos del ${reserva.fechaIngreso} al ${reserva.fechaEgreso}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => {
              console.log("Reserva confirmada:", reserva);
              navigation.navigate("MenuPago", { reserva }); // 👈 ENVÍA LA RESERVA A MenuPagoScreen
            },
          },
        ]
      );
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
          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DETALLE */}
      <View style={styles.detail}>
        <Text style={styles.title}>{propiedad.title}</Text>

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
              propiedad.servicios.map((s: string) => (
                <View key={s} style={styles.checkboxRow}>
                  <View style={[styles.checkbox, styles.checkboxChecked]} />
                  <Text>{s}</Text>
                </View>
              ))
            ) : (
              <Text>No hay servicios disponibles.</Text>
            )}
          </View>

          {/* Datos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complete los siguientes campos:</Text>

            <Text>Cantidad de inquilinos:</Text>
            <View style={styles.btnGroup}>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.numBtn, cantidadInquilinos === num && styles.numBtnSelected]}
                  onPress={() => setCantidadInquilinos(num)}
                >
                  <Text style={[styles.numBtnText, cantidadInquilinos === num && { color: "#fff" }]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>

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
          <TouchableOpacity style={styles.btnPrimary} onPress={validarYReservar}>
            <Text style={styles.btnText}>Realizar reserva</Text>
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
