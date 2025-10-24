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

    /*imageLarge: {
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
    },*/
    /* Carrusel */
    carousel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    imageLarge: {
        width: 360,   // antes 280
        height: 230,  // antes 180
        borderRadius: 12,
        marginHorizontal: 10,
        resizeMode: "cover",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    navBtn: {
        position: "relative",
        backgroundColor: "rgba(0,0,0,0.4)", // un poco más visible
        borderRadius: 40,  // antes 30
        width: 44,         // antes 30
        height: 44,        // antes 30
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 4,
    },
    navBtnText: {
        color: "#fff",
        fontSize: 28,  // antes 20
        fontWeight: "bold",
        lineHeight: 28,
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

    // TODO DE LOS RESUMENES
    resumenContainer: {
        flexDirection: "row",
        justifyContent: "center", // centra todo horizontalmente
        alignItems: "stretch",
        gap: 12,
        flexWrap: "wrap", // para que se apilen en pantallas chicas
    },

    resumenBox: {
        flex: 1,
        minWidth: 160, // ancho mínimo
        backgroundColor: "#fff", // mismo fondo
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#ddd",
        elevation: 2,
    },
});
