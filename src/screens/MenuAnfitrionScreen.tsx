import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles/MenuAnfitrionStyles";
import propiedadesData from "../data/propiedades.json";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Propiedad } from "../types/Propiedad";


type MenuAnfitrionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuAnfitrion"

>;

const imagenes: Record<string, any> = {
  "1": require("../assets/propiedades/1/IMG1.jpg"),
  "2": require("../assets/propiedades/2/IMG1.jpg"),
  "3": require("../assets/propiedades/3/IMG1.jpg"),
  "4": require("../assets/propiedades/4/IMG1.jpg"),
  "5": require("../assets/propiedades/5/IMG1.jpg"),
  "6": require("../assets/propiedades/6/IMG1.jpg"),
  "7": require("../assets/propiedades/7/IMG1.jpg"),
  "8": require("../assets/propiedades/8/IMG1.jpg"),
  "9": require("../assets/propiedades/9/IMG1.jpg"),
};

export const MenuAnfitrionScreen: React.FC = () => {
  const navigation = useNavigation<MenuAnfitrionNavigationProp>();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [propSeleccionada, setPropSeleccionada] = useState<Propiedad | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // --- Cargar propiedades ---
  useEffect(() => {
    const cargarPropiedades = async () => {
      try {
        const guardadas = await AsyncStorage.getItem("propiedades");
        if (guardadas) {
          setPropiedades(JSON.parse(guardadas));
        } else {
          setPropiedades(propiedadesData);
          await AsyncStorage.setItem(
            "propiedades",
            JSON.stringify(propiedadesData)
          );
        }
      } catch (err) {
        console.error("Error al cargar propiedades:", err);
      } finally {
        setLoading(false);
      }
    };
    cargarPropiedades();
  }, []);

  // --- Dar de baja propiedad ---
  const darDeBaja = async (id: string) => {
    Alert.alert(
      "Confirmar",
      "¿Seguro que deseas dar de baja esta propiedad?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: async () => {
            const actualizadas = propiedades.filter((p) => p.id !== id);
            setPropiedades(actualizadas);
            await AsyncStorage.setItem(
              "propiedades",
              JSON.stringify(actualizadas)
            );
            setPropSeleccionada(null);
          },
        },
      ]
    );
  };

  // --- Editar propiedad ---
  /*const editarPropiedad = async (id: string) => {
    await AsyncStorage.setItem("propiedadEditar", id);
    navigation.navigate("MenuEditar" as never);
  };*/
  const editarPropiedad = (prop: Propiedad) => {
    navigation.navigate("MenuEditar", { propiedad: prop });
  };

  if (loading) {
    return (
      <View
        style={[styles.page, { justifyContent: "center", alignItems: "center" }]}
      > <ActivityIndicator size="large" color="#4caf50" />
        <Text style={{ marginTop: 10 }}>Cargando propiedades...</Text> </View>
    );
  }

  return (<View style={styles.page}>
    {/* HEADER */}
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logoTerminado.png")}
          style={styles.logo}
        /> <Text style={styles.brandName}>OpenLodge</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.button, styles.activeButton]}>
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MenuPublicar" as never)}
        >
          <Text style={styles.buttonText}>Publicar propiedad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* MAIN */}
    <View style={styles.main}>
      {/* LISTADO DE PROPIEDADES */}
      <ScrollView
        style={styles.cardArea}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={true}
      >
        {propiedades.length > 0 ? (
          propiedades.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.card,
                propSeleccionada?.id === p.id && {
                  borderColor: "#4caf50",
                  borderWidth: 2,
                },
              ]}
              onPress={() => setPropSeleccionada(p)}
            >
              <Text style={styles.address}>{p.title}</Text>
              <Image
                source={imagenes[p.id] || require("../assets/logoTerminado.png")}
                style={styles.image}
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.seeBtn}
                  onPress={() => setPropSeleccionada(p)}
                >
                  <Text style={styles.seeBtnText}>Editar propiedad</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.detailEmpty}>
            No se encontraron propiedades.
          </Text>
        )}
      </ScrollView>

      {/* PANEL DE DETALLE */}
      <View style={styles.detail}>
        {propSeleccionada ? (
          <>
            <Text style={styles.detailTitle}>{propSeleccionada.title}</Text>
            <Image
              source={imagenes[propSeleccionada.id] || require("../assets/logoTerminado.png")}
              style={[styles.image, { height: 180, marginBottom: 10 }]}
            />
            <Text style={styles.detailSubtitle}>Detalles:</Text>
            <ScrollView style={{ flex: 1 }}>
              {propSeleccionada.details.map((d, i) => (
                <Text key={i} style={styles.detailItem}>
                  • {d}
                </Text>
              ))}
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => editarPropiedad(propSeleccionada!)}
              >
                <Text style={styles.btnText}>Editar detalles</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnGhost}
                onPress={() => darDeBaja(propSeleccionada.id)}
              >
                <Text style={styles.btnGhostText}>Dar de baja</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.detailEmpty}>
            Selecciona una propiedad para ver sus detalles.
          </Text>
        )}
      </View>
    </View>
  </View>

  );
};

export default MenuAnfitrionScreen;
