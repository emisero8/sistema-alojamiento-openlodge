import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { styles } from "./styles/MenuHuespedStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { Propiedad } from "../types/Propiedad";


type MenuHuespedNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuHuesped"
>;

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

const API_URL = "http://172.20.10.2:8080";

export const MenuHuespedScreen: React.FC = () => {
  const navigation = useNavigation<MenuHuespedNavigationProp>();

  const { logout } = useAuth();


  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [loading, setLoading] = useState(true);
  const [propSeleccionada, setPropSeleccionada] = useState<Propiedad | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarPropiedades = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/propiedades`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al cargar las propiedades');
      }

      const data: Propiedad[] = await response.json();
      setPropiedades(data);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPropiedades();
    }, [])
  );

  // Lógica de filtrado
  const propiedadesFiltradas = propiedades.filter((p) => {
    const matchDireccion = p.direccion.toLowerCase().includes(busqueda.toLowerCase());
    const matchTitulo = p.titulo.toLowerCase().includes(busqueda.toLowerCase());

    const min = precioMin ? parseInt(precioMin) : 0;
    const max = precioMax ? parseInt(precioMax) : Infinity;

    const matchPrecio = p.precioPorNoche >= min && p.precioPorNoche <= max;

    return (matchDireccion || matchTitulo) && matchPrecio;
  });

  if (loading) {
    return (
      <View style={[styles.page, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={{ marginTop: 10 }}>Cargando propiedades...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.page, { height: "100vh" } as any]} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logoTerminado.png")} style={styles.logo}
            /><Text style={styles.brandName}>OpenLodge</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={[styles.button, styles.activeButton]}>
              <Text style={styles.buttonText}>Menú principal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("MenuMiCuenta")}
            >
              <Text style={styles.buttonText}>Mi Cuenta</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Buscar por dirección..."
              style={styles.input}
              value={busqueda}
              onChangeText={setBusqueda}
            />
            <TouchableOpacity style={styles.button} onPress={() => setMostrarModal(true)}>
              <Text style={styles.buttonText}>Filtrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAIN */}
        <View style={styles.main}>
          {/* LISTA DE PROPIEDADES */}
          {propSeleccionada === null ? (
            <ScrollView
              style={styles.cardArea}
              contentContainerStyle={styles.cardContent}
            >
              {error && <Text style={styles.detailEmpty}>Error: {error}</Text>}

              {!loading && !error && propiedadesFiltradas.length === 0 && (
                <Text style={styles.detailEmpty}>No se encontraron propiedades.</Text>
              )}
              {propiedadesFiltradas.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.card,
                  ]}
                  onPress={() => setPropSeleccionada(p)}
                >
                  <Text style={styles.address}>{p.titulo}</Text>
                  <Text style={styles.addressDetail}>{p.direccion}</Text>
                  <Image
                    source={imagenes[p.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                    style={styles.image}
                  />
                  <Text style={styles.status}>Precio: ${p.precioPorNoche.toLocaleString()}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.seeBtn} onPress={() => setPropSeleccionada(p)}>
                      <Text style={styles.seeBtnText}>Ver más detalles</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

          ) : (

            // Vista de detalle
            <View style={styles.detail}>
              <>
                <Text style={styles.detailTitle}>{propSeleccionada.titulo}</Text>
                <Text style={styles.detailDireccion}>{propSeleccionada.direccion}</Text>
                <Image
                  source={imagenes[propSeleccionada.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                  style={[styles.image, { height: 180, marginBottom: 10 }]}
                />
                <Text style={styles.detailSubtitle}>Detalles de la propiedad:</Text>
                <ScrollView style={{ flex: 1 }}>
                  <Text style={styles.detailItem}>
                    {propSeleccionada.descripcion}
                  </Text>
                  <Text style={[styles.detailSubtitle, { marginTop: 10 }]}>
                    Servicios:
                  </Text>
                  {propSeleccionada.servicios.length > 0 ? (
                    propSeleccionada.servicios.map((s) => (
                      <Text key={s.id} style={styles.detailItem}>
                        • {s.nombre}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.detailItem}>No hay servicios asignados.</Text>
                  )}
                </ScrollView>
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#4caf50", flex: 1, marginRight: 8 }]}
                    onPress={() =>
                      navigation.navigate("MenuAlquilar", { propiedad: propSeleccionada })
                    }
                  >
                    <Text style={styles.buttonText}>Alquilar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#ccc", flex: 1 }]}
                    onPress={() => setPropSeleccionada(null)}
                  >
                    <Text style={[styles.buttonText, { color: "#000" }]}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          )}
        </View>

        {/* MODAL DE FILTROS */}
        <Modal transparent visible={mostrarModal} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Filtrar por precio</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Precio mínimo"
                keyboardType="numeric"
                value={precioMin}
                onChangeText={setPrecioMin}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Precio máximo"
                keyboardType="numeric"
                value={precioMax}
                onChangeText={setPrecioMax}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#4caf50" }]}
                  onPress={() => setMostrarModal(false)}
                >
                  <Text style={styles.buttonText}>Aplicar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#d32f2f" }]}
                  onPress={() => {
                    setPrecioMin("");
                    setPrecioMax("");
                    setMostrarModal(false);
                  }}
                >
                  <Text style={styles.buttonText}>Limpiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default MenuHuespedScreen;
