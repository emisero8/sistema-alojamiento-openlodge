import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    page: {
        /*flex: 1,*/
        backgroundColor: "#fffbe6",
        padding: 16,
    },

    /* HEADER */
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

    /* DETALLE PRINCIPAL */
    detail: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: "#ddd",
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2e7d32",
        marginBottom: 10,
        textAlign: "center",
    },

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

    /* Secciones */
    columns: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    section: {
        flex: 1,
        minWidth: "30%",
        padding: 10,
    },
    sectionTitle: {
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },

    /* Servicios */
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: "#4caf50",
        borderRadius: 4,
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: "#4caf50",
    },

    /* Inquilinos */
    btnGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 6,
    },
    numBtn: {
        width: 35,
        height: 35,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#4caf50",
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
    },
    numBtnSelected: {
        backgroundColor: "#4caf50",
    },
    numBtnText: {
        color: "#000",
    },

    /* Notas */
    textArea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        height: 120,
        textAlignVertical: "top",
        backgroundColor: "#fff",
    },

    /* Botones inferiores */
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
        borderColor: "#d32f2f",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    btnGhostText: {
        color: "#d32f2f",
        fontWeight: "600",
    },
});
