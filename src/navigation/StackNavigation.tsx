import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import MenuHuespedScreen from "../screens/MenuHuespedScreen";
import MenuAlquilarScreen from "../screens/MenuAlquilarScreen";
import MenuPagoScreen from "../screens/MenuPagoScreen";
import MenuAnfitrionScreen from "../screens/MenuAnfitrionScreen";
import MenuEditarScreen from "../screens/MenuEditarScreen";
import { Propiedad } from "../types/Propiedad";
import { MenuGestionarScreen } from "../screens/MenuGestionarScreen";
import MenuPublicarScreen from "../screens/MenuPublicarScreen";
import MenuMiCuentaScreen from "../screens/MenuMiCuentaScreen";
import MenuMiCuentaAnfitrionScreen from "../screens/MenuMiCuentaAnfitrionScreen";
import RegisterScreen from "../screens/RegisterScreen";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    /* Flujo de Huesped */
    MenuHuesped: undefined;
    MenuMiCuenta: undefined;
    MenuAlquilar: { propiedad: any };
    MenuPago: { reserva: any };
    /* Flujo de Anfitrion */
    MenuAnfitrion: undefined;
    MenuEditar: { propiedad: Propiedad };
    MenuGestionar: undefined;
    MenuMiCuentaA: undefined;
    MenuPublicar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    // Llama al hook 'useAuth' para obtener las variables del contexto
    const { token, rol } = useAuth();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token == null ? (
                // STACK SI NO ESTÁ LOGUEADO
                // Si no hay token, solo mostramos la pantalla de Login
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : rol === 'HUESPED' ? (
                // --- STACK SI ES ROL "HUESPED" ---
                // Si hay token y el rol es Huesped, mostramos sus pantallas
                <>
                    <Stack.Screen name="MenuHuesped" component={MenuHuespedScreen} />
                    <Stack.Screen name="MenuMiCuenta" component={MenuMiCuentaScreen} />
                    <Stack.Screen name="MenuAlquilar" component={MenuAlquilarScreen} />
                    <Stack.Screen name="MenuPago" component={MenuPagoScreen} />
                </>
            ) : (
                // --- STACK SI ES ROL "ANFITRION" ---
                <>
                    <Stack.Screen name="MenuAnfitrion" component={MenuAnfitrionScreen} />
                    <Stack.Screen name="MenuEditar" component={MenuEditarScreen} />
                    <Stack.Screen name="MenuGestionar" component={MenuGestionarScreen} />
                    <Stack.Screen name="MenuMiCuentaA" component={MenuMiCuentaAnfitrionScreen} />
                    <Stack.Screen name="MenuPublicar" component={MenuPublicarScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default StackNavigator;
