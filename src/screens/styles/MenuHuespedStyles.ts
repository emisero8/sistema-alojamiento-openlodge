import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    page: {
        flex: 1, // Es importante que el 'page' principal ocupe todo el espacio
        backgroundColor: '#fffbe6',
        padding: 16,
    },

    // --- HEADER ---
    header: {
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        height: 60,
        width: 60,
        resizeMode: 'contain',
    },
    brandName: {
        fontWeight: '700',
        fontSize: 24,
        color: '#2e7d32',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    activeButton: {
        backgroundColor: '#ffc107',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: 180,
    },
    logoutBtn: {
        borderWidth: 2,
        borderColor: '#d32f2f',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
    },
    logoutText: {
        color: '#d32f2f',
        fontWeight: '600',
    },

    // --- MAIN LAYOUT ---
    main: {
        flex: 1,
        //flexDirection: 'column', // ⬅️ CAMBIO: Por defecto, se apilan en columna
        //flexWrap: 'wrap',        // ⬅️ AÑADIDO: Permite que los elementos se envuelvan
        //justifyContent: 'flex-start', // Opcional, para alinear al inicio
        //alignItems: 'stretch',   // ⬅️ CAMBIO: Para que los elementos se estiren en el eje transversal
        //gap: 16, // Espacio entre cardArea y detail
    },

    // --- ZONA DE TARJETAS ---
    cardArea: {
        flex: 1,
        // height: 650, // ⬅️ BORRADO (Ya lo habíamos quitado)
        borderWidth: 2,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 8,
    },
    cardContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingBottom: 20,
        gap: 16,
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        flexBasis: '47%',
        padding: 12,
        elevation: 3,
    },
    address: {
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 6,
        marginBottom: 6,
    },
    status: {
        textAlign: 'center',
        color: '#444',
        marginBottom: 8,
    },
    actions: {
        alignItems: 'center',
    },
    seeBtn: {
        backgroundColor: '#4caf50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    seeBtnText: {
        color: '#fff',
        fontWeight: '600',
    },

    // --- PANEL DE DETALLE ---
    detail: {
        flex: 1,
        // height: 650, // ⬅️ BORRADO (Ya lo habíamos quitado)
        borderWidth: 2,
        borderColor: '#cfcfcf',
        borderRadius: 10,
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 16, // ⬅️ AÑADIDO: Espacio superior cuando está apilado
        justifyContent: 'flex-start',
    },
    detailEmpty: {
        color: '#777',
        textAlign: 'center',
    },
    detailTitle: {
        fontWeight: "700",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 8,
    },
    detailSubtitle: {
        fontWeight: "600",
        fontSize: 16,
        marginTop: 12,
        marginBottom: 6,
    },
    detailItem: {
        fontSize: 15,
        color: "#444",
        marginLeft: 8,
        marginBottom: 2,
    },
    footer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 16,
    },
    btnPrimary: {
        backgroundColor: "#4caf50",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
    btnGhost: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#d32f2f",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
    },
    btnGhostText: {
        color: "#d32f2f",
        fontWeight: "600",
    },
    // --- Modal de filtro ---
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },
    modalInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 6,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        width: "100%",
    },
});