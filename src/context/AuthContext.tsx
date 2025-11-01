import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ActivityIndicator, View } from 'react-native';

// 1. DEFINE LA IP DE TU API (¡la misma que en LoginScreen!)
const API_URL = "http://localhost:8080";

// 2. Define la "forma" de tu contexto
interface AuthContextType {
    token: string | null;
    rol: string | null;
    isLoading: boolean; // Para mostrar una pantalla de carga al inicio
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 3. Crea el Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Define el "Proveedor" (el componente que envolverá tu app)
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [rol, setRol] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Empezamos cargando

    // 5. Función para comprobar si hay un token al abrir la app
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('@auth_token');
                const storedRol = await AsyncStorage.getItem('@auth_rol'); // También guardaremos el rol

                if (storedToken && storedRol) {
                    setToken(storedToken);
                    setRol(storedRol);
                }
            } catch (e) {
                console.error("Failed to load auth data", e);
            } finally {
                setIsLoading(false); // Terminamos de cargar
            }
        };

        loadToken();
    }, []);

    // 6. Función de Login (¡AHORA LA MANEJA EL CONTEXTO!)
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                Alert.alert("Error de inicio de sesión", "Correo o contraseña incorrectos.");
                return;
            }

            const data: { token: string; rol: string } = await response.json();

            // Guardamos en el estado
            setToken(data.token);
            setRol(data.rol);

            // Guardamos en el dispositivo
            await AsyncStorage.setItem('@auth_token', data.token);
            await AsyncStorage.setItem('@auth_rol', data.rol);

        } catch (error) {
            console.error(error);
            Alert.alert("Error de red", "No se pudo conectar al servidor.");
        }
    };

    // 7. Función de Logout
    const logout = async () => {
        setToken(null);
        setRol(null);
        await AsyncStorage.removeItem('@auth_token');
        await AsyncStorage.removeItem('@auth_rol');
    };

    // 8. Si estamos cargando el token, muestra un spinner
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // 9. Provee los valores al resto de la app
    return (
        <AuthContext.Provider value={{ token, rol, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 10. Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};