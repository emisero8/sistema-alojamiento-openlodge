import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import MenuHuespedScreen from "../screens/MenuHuespedScreen";
import MenuAlquilarScreen from "../screens/MenuAlquilarScreen";
import { StyleSheet } from "react-native";
import MenuPagoScreen from "../screens/MenuPagoScreen";

export type RootStackParamList = {
    Login: undefined;
    MenuHuesped: undefined;
    MenuAlquilar: { propiedad: any };
    MenuPago: { reserva: any };
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;
