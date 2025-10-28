import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "#fffbe6",
        alignItems: "center",
        paddingTop: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    brand: {
        fontSize: 26,
        fontWeight: "700",
        color: "#2e7d32",
        marginBottom: 10,
    },
    topControls: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
    },
    btnNav: {
        backgroundColor: "#4caf50",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        margin: 5,
    },
    btnActive: {
        backgroundColor: "#ffc107",
    },
    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
    textActive: {
        color: "#333",
    },
    container: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginTop: 20,
    },
    solicitud: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    propiedad: {
        fontWeight: "600",
        marginBottom: 8,
        fontSize: 16,
        color: "#333",
    },
    text: {
        fontSize: 14,
        marginBottom: 4,
    },
    acciones: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
    },
    btnAceptar: {
        backgroundColor: "#4caf50",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    btnCancelar: {
        backgroundColor: "#d32f2f",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
});
