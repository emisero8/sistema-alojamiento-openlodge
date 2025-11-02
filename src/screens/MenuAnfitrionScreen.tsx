import React, { useState, useCallback } from "react"; // 1. Importamos useCallback
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
// import propiedadesData from "../data/propiedades.json"; // ⬅️ BORRADO
import { useNavigation, useFocusEffect, RouteProp } from "@react-navigation/native"; // 2. Importamos useFocusEffect
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigation";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // ⬅️ BORRADO (el context se encarga)
import { useAuth } from "../context/AuthContext"; // 3. ¡IMPORTAMOS EL CONTEXTO!
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

// 5. Definimos la URL de la API
const API_URL = "http://localhost:8080";

type MenuAnfitrionNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuAnfitrion"
>;

export const MenuAnfitrionScreen: React.FC = () => {
  const navigation = useNavigation<MenuAnfitrionNavigationProp>();

  // 6. Obtenemos el token y la función logout del contexto
  const { token, logout } = useAuth();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [propSeleccionada, setPropSeleccionada] = useState<Propiedad | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para errores

  // --- 7. Cargar propiedades (TODA LA LÓGICA ANTIGUA REEMPLAZADA) ---
  const cargarPropiedades = async () => {
    if (!token) return; // No hacer nada si no hay token

    setLoading(true);
    setError(null);
    setPropSeleccionada(null); // Limpiamos la selección anterior

    try {
      const response = await fetch(`${API_URL}/api/propiedades/mis-propiedades`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // ¡Enviamos el token!
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

  // 8. Usamos 'useFocusEffect' para recargar cada vez que vemos la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarPropiedades();
    }, [token]) // Solo se recalcula si el token cambia
  );

  // --- 9. Dar de baja propiedad --- PARA WEB
  const darDeBaja = async (id: number) => {
    if (!token) {
      Alert.alert("Error", "No estás autenticado.");
      return;
    }

    // 1. Usamos 'window.confirm' en lugar de 'Alert.alert' para la web
    //    Esto mostrará un pop-up simple de Aceptar/Cancelar.
    const confirmacion = window.confirm(
      "¿Seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer."
    );

    // 2. Si el usuario presiona "Cancelar", 'confirmacion' será false
    if (!confirmacion) {
      return; // No hacemos nada
    }

    // 3. Si el usuario presionó "Aceptar", ejecutamos la lógica de borrado
    setLoading(true); // Mostramos spinner
    try {
      // 4. Llamamos a la API con el método DELETE y el token
      const response = await fetch(`${API_URL}/api/propiedades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        Alert.alert("Error", "No tienes permiso para borrar esta propiedad o tu sesión expiró.");
        logout(); // Forzamos logout por seguridad
        return;
      }
      if (!response.ok) {
        throw new Error("No se pudo eliminar la propiedad.");
      }

      // 5. ¡Éxito! Usamos 'Alert.alert' simple (que sí funciona)
      Alert.alert("Éxito", "Propiedad eliminada correctamente.");
      setPropiedades(prev => prev.filter((p) => p.id !== id));
      setPropSeleccionada(null); // Limpiamos la selección

    } catch (err: any) {
      Alert.alert("Error", err.message || "Ocurrió un problema.");
    } finally {
      setLoading(false); // Ocultamos spinner
    }
  };

  // --- Editar propiedad ---
  // (Tu lógica de navegación está perfecta y no necesita cambios)
  const editarPropiedad = (prop: Propiedad) => {
    navigation.navigate("MenuEditar", { propiedad: prop });
  };

  // (Tu 'if (loading)' está perfecto y no necesita cambios)
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
        {/* ... (Tu logo y brandName quedan igual) ... */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logoTerminado.png")}
            style={styles.logo}
          /> <Text style={styles.brandName}>OpenLodge</Text>
        </View>

        <View style={styles.controls}>
          {/* ... (Tus botones de navegación quedan igual) ... */}
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

          {/* 10. ¡Botón de Logout CONECTADO! */}
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
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
        >
          {/* 11. Manejo de error y lista vacía */}
          {error && <Text style={styles.detailEmpty}>Error: {error}</Text>}

          {!loading && !error && propiedades.length === 0 && (
            <Text style={styles.detailEmpty}>
              No se encontraron propiedades. ¡Publica tu primera propiedad!
            </Text>
          )}

          {propiedades.map((p) => (
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
              {/* 12. CAMBIO: p.title ahora es p.titulo */}
              <Text style={styles.address}>{p.titulo}</Text>

              {/* Tu lógica de 'imagenes' sigue funcionando si los IDs coinciden */}
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

        {/* PANEL DE DETALLE */}
        <View style={styles.detail}>
          {propSeleccionada ? (
            <>
              {/* 13. CAMBIO: propSeleccionada.title ahora es .titulo */}
              <Text style={styles.detailTitle}>{propSeleccionada.titulo}</Text>
              <Image
                source={imagenes[propSeleccionada.imagenPrincipalUrl] || require("../assets/logoTerminado.png")}
                style={[styles.image, { height: 180, marginBottom: 10 }]}
              />
              <Text style={styles.detailSubtitle}>Descripción:</Text>
              <ScrollView style={{ flex: 1 }}>
                {/* 14. CAMBIO: Reemplazamos 'details' por 'descripcion' y 'servicios' */}
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