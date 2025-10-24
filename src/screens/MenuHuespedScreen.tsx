import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";

interface Propiedad {
  id: string;
  title: string;
  img: string;
  details: string[];
  servicios: string[];
  price: number;
}

type MenuHuespedNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuHuesped"
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

export const MenuHuespedScreen: React.FC = () => {
  const navigation = useNavigation<MenuHuespedNavigationProp>();


  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [loading, setLoading] = useState(true);
  const [propSeleccionada, setPropSeleccionada] = useState<Propiedad | null>(null);

  useEffect(() => {
    setPropiedades(propiedadesData);
    setLoading(false);
  }, []);

  const propiedadesFiltradas = propiedades.filter((p) => {
    const matchDireccion = p.title.toLowerCase().includes(busqueda.toLowerCase());
    const min = precioMin ? parseInt(precioMin) : 0;
    const max = precioMax ? parseInt(precioMax) : Infinity;
    const matchPrecio = p.price >= min && p.price <= max;
    return matchDireccion && matchPrecio;
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
          <TouchableOpacity style={styles.logoutBtn}>
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
          showsVerticalScrollIndicator={true}
        >
          {propiedadesFiltradas.length > 0 ? (
            propiedadesFiltradas.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.card,
                  propSeleccionada?.id === p.id && { borderColor: "#4caf50", borderWidth: 2 },
                ]}
                onPress={() => setPropSeleccionada(p)}
              >
                <Text style={styles.address}>{p.title}</Text>
                <Image
                  source={imagenes[p.id] || require("../assets/logoTerminado.png")}
                  style={styles.image}
                />
                <Text style={styles.status}>Precio: ${p.price.toLocaleString()}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.seeBtn} onPress={() => setPropSeleccionada(p)}>
                    <Text style={styles.seeBtnText}>Ver más detalles</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.detailEmpty}>No se encontraron propiedades.</Text>
          )}
        </ScrollView>

        {/* PANEL DE DETALLES */}
        <View style={styles.detail}>
          {propSeleccionada ? (
            <>
              <Text style={styles.detailTitle}>{propSeleccionada.title}</Text>
              <Image
                source={imagenes[propSeleccionada.id] || require("../assets/logoTerminado.png")}
                style={[styles.image, { height: 180, marginBottom: 10 }]}
              />
              <Text style={styles.detailSubtitle}>Detalles de la propiedad:</Text>
              <ScrollView style={{ /*maxHeight: 200*/ flex: 1 }}>
                {propSeleccionada.details.map((d, i) => (
                  <Text key={i} style={styles.detailItem}>
                    • {d}
                  </Text>
                ))}
                <Text style={[styles.detailSubtitle, { marginTop: 10 }]}>
                  Servicios:
                </Text>
                {propSeleccionada.servicios.map((s, i) => (
                  <Text key={i} style={styles.detailItem}>
                    • {s}
                  </Text>
                ))}
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
