import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    page: {
        /*flex: 1,*/
        backgroundColor: "#fffbe6",
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logo: {
        height: 60,
        width: 60,
        resizeMode: "contain",
    },
    brandName: {
        fontWeight: "700",
        fontSize: 24,
        color: "#2e7d32",
    },
    controls: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 10,
    },
    button: {
        backgroundColor: "#4caf50",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    logoutBtn: {
        borderWidth: 2,
        borderColor: "#d32f2f",
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
    logoutText: {
        color: "#d32f2f",
        fontWeight: "600",
    },
    form: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 20,
        elevation: 3,
    },
    label: {
        fontWeight: "600",
        fontSize: 14,
        marginTop: 10,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
        backgroundColor: "#fff",
    },
    preview: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderStyle: "dashed",
        borderRadius: 6,
        height: 140,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    previewText: {
        color: "#777",
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 6,
    },
    servicios: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginVertical: 10,
    },
    servicioItem: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    servicioActivo: {
        backgroundColor: "#4caf50",
        borderColor: "#4caf50",
    },
    servicioText: {
        color: "#333",
    },
    servicioTextActivo: {
        color: "#fff",
        fontWeight: "600",
    },
    acciones: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 16,
    },
    btnPrimary: {
        backgroundColor: "#4caf50",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    btnDanger: {
        backgroundColor: "#d32f2f",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
});
