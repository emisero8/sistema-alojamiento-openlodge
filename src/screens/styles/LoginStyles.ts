import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    loginBox: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        width: 300,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        textAlign: "center",
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 8,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    googleButton: {
        backgroundColor: "#db4437",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    link: {
        textAlign: "center",
        marginBottom: 10,
        color: "#007BFF",
    },
});