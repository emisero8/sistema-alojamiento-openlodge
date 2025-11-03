import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    page: {
        /*flex: 1,*/
        backgroundColor: "#fffbe6",
        padding: 16,
    },
    header: {
        alignItems: "center",
        gap: 12,
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
        alignItems: "center",
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
    activeButton: {
        backgroundColor: "#ffc107",
    },
    activeText: {
        color: "#333",
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

    // --- Formulario ---
    form: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        backgroundColor: "#fff",
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 8,
        fontSize: 14,
    },
    uploadBtn: {
        backgroundColor: "#4caf50",
        borderRadius: 6,
        paddingVertical: 8,
        alignItems: "center",
        marginTop: 8,
    },
    uploadText: {
        color: "#fff",
        fontWeight: "600",
    },
    previewContainer: {
        marginTop: 10,
        flexDirection: "row",
    },
    previewImg: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 8,
    },
    previewText: {
        color: "#777",
    },
    servicios: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    servicioBtn: {
        borderWidth: 1,
        borderColor: "#4caf50",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    servicioBtnActive: {
        backgroundColor: "#4caf50",
    },
    servicioText: {
        color: "#4caf50",
    },
    servicioTextActive: {
        color: "#fff",
    },
    actions: {
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
