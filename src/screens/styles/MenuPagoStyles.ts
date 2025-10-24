import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    page: {
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
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
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

    // Contenido
    detail: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#ddd",
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },

    imageLarge: {
        position: "relative",
        alignSelf: "center",
        width: "90%",
        height: 220,
        borderRadius: 10,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    propertyImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    navBtn: {
        position: "absolute",
        top: "45%",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    navBtnText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },

    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        color: "#333",
    },

    radioGroup: {
        flexDirection: "column",
        gap: 10,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#4caf50",
        marginRight: 8,
    },
    radioCircleSelected: {
        backgroundColor: "#4caf50",
    },
    radioLabel: {
        fontSize: 15,
    },

    buttons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 20,
    },
    btnPrimary: {
        backgroundColor: "#4caf50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
    btnGhost: {
        borderWidth: 2,
        borderColor: "#ffc107",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnGhostText: {
        color: "#ffc107",
        fontWeight: "600",
    },
});
