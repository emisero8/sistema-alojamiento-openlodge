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
import propiedadesData from "../data/propiedades.json";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { Propiedad } from "../types/Propiedad";


type MenuHuespedNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuHuesped"
>;


/*const imagenes: Record<string, any> = {
  "1": require("../assets/propiedades/1/IMG1.jpg"),
  "2": require("../assets/propiedades/2/IMG1.jpg"),
  "3": require("../assets/propiedades/3/IMG1.jpg"),
  "4": require("../assets/propiedades/4/IMG1.jpg"),
  "5": require("../assets/propiedades/5/IMG1.jpg"),
  "6": require("../assets/propiedades/6/IMG1.jpg"),
  "7": require("../assets/propiedades/7/IMG1.jpg"),
  "8": require("../assets/propiedades/8/IMG1.jpg"),
  "9": require("../assets/propiedades/9/IMG1.jpg"),
};*/

// La clave AHORA es el path de la imagen
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

const API_URL = "http://localhost:8080";

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

  // --- Cargar propiedades (Lógica reemplazada) ---
  const cargarPropiedades = async () => {
    setLoading(true);
    setError(null);

    try {
      // Este es el endpoint PÚBLICO, no necesita token
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

  // Usamos 'useFocusEffect' para recargar cada vez que vemos la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarPropiedades();
    }, []) // Dependencia vacía, se ejecuta solo al enfocar
  );

  // Lógica de filtrado (ACTUALIZADA con los campos de la API)
  const propiedadesFiltradas = propiedades.filter((p) => {
    // Buscamos por 'direccion' O 'titulo'
    const matchDireccion = p.direccion.toLowerCase().includes(busqueda.toLowerCase());
    const matchTitulo = p.titulo.toLowerCase().includes(busqueda.toLowerCase());

    const min = precioMin ? parseInt(precioMin) : 0;
    const max = precioMax ? parseInt(precioMax) : Infinity;
    // CAMBIO: p.price -> p.precioPorNoche
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
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logoTerminado.png")} style={styles.logo} />
          <Text style={styles.brandName}>OpenLodge</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={[styles.button, styles.activeButton]}>
            <Text style={styles.buttonText}>Menú principal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
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
                propSeleccionada?.id === p.id && { borderColor: "#4caf50", borderWidth: 2 },
              ]}
              onPress={() => setPropSeleccionada(p)}
            >
              {/* 10. CAMBIO: p.title -> p.titulo */}
              <Text style={styles.address}>{p.titulo}</Text>
              <Image
                // CAMBIO: p.id -> p.id.toString()
                source={imagenes[p.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                style={styles.image}
              />
              {/* 11. CAMBIO: p.price -> p.precioPorNoche */}
              <Text style={styles.status}>Precio: ${p.precioPorNoche.toLocaleString()}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.seeBtn} onPress={() => setPropSeleccionada(p)}>
                  <Text style={styles.seeBtnText}>Ver más detalles</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PANEL DE DETALLES */}
        <View style={styles.detail}>
          {propSeleccionada ? (
            <>
              <Text style={styles.detailTitle}>{propSeleccionada.titulo}</Text>
              <Image
                source={imagenes[propSeleccionada.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                style={[styles.image, { height: 180, marginBottom: 10 }]}
              />
              <Text style={styles.detailSubtitle}>Detalles de la propiedad:</Text>
              <ScrollView style={{ /*maxHeight: 200*/ flex: 1 }}>
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
          ) : (
            <Text style={styles.detailEmpty}>
              Haz click en "Ver más detalles" para ver la información de la propiedad seleccionada.
            </Text>
          )}
        </View>
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
  );
};

export default MenuHuespedScreen;
