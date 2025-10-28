import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import MenuHuespedScreen from "../screens/MenuHuespedScreen";
import MenuAlquilarScreen from "../screens/MenuAlquilarScreen";
import MenuPagoScreen from "../screens/MenuPagoScreen";
import MenuAnfitrionScreen from "../screens/MenuAnfitrionScreen";
import MenuEditarScreen from "../screens/MenuEditarScreen";
import { Propiedad } from "../types/Propiedad";
import { MenuGestionarScreen } from "../screens/MenuGestionarScreen";
import MenuHistorialScreen from "../screens/MenuHistorialScreen";
import MenuPublicarScreen from "../screens/MenuPublicarScreen";

export type RootStackParamList = {
    Login: undefined;
    /* Flujo de Huesped */
    MenuHuesped: undefined;
    MenuAlquilar: { propiedad: any };
    MenuPago: { reserva: any };
    /* Flujo de Anfitrion */
    MenuAnfitrion: undefined;
    MenuEditar: { propiedad: Propiedad };
    MenuGestionar: undefined;
    MenuHistorial: undefined;
    MenuPublicar: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuHuesped"
                    component={MenuHuespedScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuAlquilar"
                    component={MenuAlquilarScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuPago"
                    component={MenuPagoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuAnfitrion"
                    component={MenuAnfitrionScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuEditar"
                    component={MenuEditarScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuGestionar"
                    component={MenuGestionarScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuHistorial"
                    component={MenuHistorialScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MenuPublicar"
                    component={MenuPublicarScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
