import React, { useState, useCallback } from "react";
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
import { useNavigation, useFocusEffect, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
import { useAuth } from "../context/AuthContext";
import { Propiedad } from "../types/Propiedad";

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

type MenuAnfitrionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuAnfitrion"
>;

export const MenuAnfitrionScreen: React.FC = () => {
  const navigation = useNavigation<MenuAnfitrionNavigationProp>();

  const { token, logout } = useAuth();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [propSeleccionada, setPropSeleccionada] = useState<Propiedad | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar propiedades
  const cargarPropiedades = async () => {
    if (!token) return; // No hacer nada si no hay token

    setLoading(true);
    setError(null);
    setPropSeleccionada(null); // Limpiamos la selección anterior

    try {
      const response = await fetch(`${API_URL}/api/propiedades/mis-propiedades`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Enviamos el token
        },
      });

      if (response.status === 403) { // Token expirado o inválido
        Alert.alert("Sesión expirada", "Por favor, inicia sesión de nuevo.");
        logout(); // Volvemos al Login
        return;
      }
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

  // 'useFocusEffect' para recargar cada vez que vemos la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarPropiedades();
    }, [token]) // Solo se recalcula si el token cambia
  );

  // Dar de baja propiedad
  const darDeBaja = async (id: number) => {
    if (!token) {
      Alert.alert("Error", "No estás autenticado.");
      return;
    }

    Alert.alert(
      "Confirmar Baja",
      "¿Seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(`${API_URL}/api/propiedades/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.status === 403) {
                Alert.alert("Error", "No tienes permiso para borrar esta propiedad o tu sesión expiró.");
                logout();
                return;
              }

              if (response.status === 409) {
                const errorMessage = await response.text(); // "No se puede borrar porque tiene reservas"
                Alert.alert("Acción Bloqueada", errorMessage);
                return;
              }

              if (!response.ok && response.status !== 204) {
                throw new Error("No se pudo eliminar la propiedad.");
              }

              Alert.alert("Éxito", "Propiedad eliminada correctamente.");
              setPropiedades(prev => prev.filter((p) => p.id !== id));
              setPropSeleccionada(null); // Limpiamos la selección

            } catch (err: any) {
              Alert.alert("Error", err.message || "Ocurrió un problema.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Editar propiedad
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

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Logo y marca */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logoTerminado.png")}
            style={styles.logo}
          /><Text style={styles.brandName}>OpenLodge</Text>
        </View>

        <View style={styles.controls}>
          {/* Botones de navegación */}
          <TouchableOpacity style={[styles.button, styles.activeButton]}>
            <Text style={styles.buttonText}>Menú principal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MenuMiCuentaA")}
          >
            <Text style={styles.buttonText}>Mi Cuenta</Text>
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

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN */}
      {/* LÓGICA CONDICIONAL */}
      {propSeleccionada === null ? (

        // VISTA DE LISTA
        <ScrollView
          style={styles.cardArea}
          contentContainerStyle={styles.cardContent}
        >
          {error && <Text style={styles.detailEmpty}>Error: {error}</Text>}
          {!loading && !error && propiedades.length === 0 && (
            <Text style={styles.detailEmpty}>
              No se encontraron propiedades. ¡Publica tu primera propiedad!
            </Text>
          )}

          {propiedades.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              onPress={() => setPropSeleccionada(p)}
            >
              <Text style={styles.address}>{p.titulo}</Text>
              <Text style={styles.addressDetail}>{p.direccion}</Text>
              <Image
                source={imagenes[p.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                style={styles.image}
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.seeBtn}
                  onPress={() => setPropSeleccionada(p)}
                >
                  <Text style={styles.seeBtnText}>Ver detalles</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      ) : (

        // VISTA DE DETALLE
        <View style={styles.detail}>
          <>
            <Text style={styles.detailTitle}>{propSeleccionada.titulo}</Text>
            <Text style={styles.detailDireccion}>{propSeleccionada.direccion}</Text>
            <Image
              source={imagenes[propSeleccionada.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
              style={[styles.image, { height: 180, marginBottom: 10 }]}
            />
            <Text style={styles.detailSubtitle}>Descripción:</Text>
            <ScrollView style={{ flex: 1 }}>
              <Text style={styles.detailItem}>
                {propSeleccionada.descripcion}
              </Text>
              <Text style={styles.detailSubtitle}>Servicios:</Text>
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
                style={styles.btnPrimary}
                onPress={() => editarPropiedad(propSeleccionada!)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnGhost}
                onPress={() => darDeBaja(propSeleccionada.id)}
              >
                <Text style={styles.btnGhostText}>Dar de baja</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setPropSeleccionada(null)}
              >
                <Text style={styles.btnText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      )}
    </View>
  );
};

export default MenuAnfitrionScreen;