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
        fontSize: 22,
        color: "#2e7d32",
    },
    topControls: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
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
    main: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    sidebar: {
        flex: 0.35,
        minWidth: 240,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    sidebarTitle: {
        fontSize: 18,
        marginBottom: 8,
    },
    profilePic: {
        alignItems: "center",
        marginVertical: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    sidebarSubtitle: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 8,
    },
    sidebarList: {
        marginTop: 6,
        marginLeft: 10,
    },
    listItem: {
        fontSize: 14,
        color: "#444",
        marginVertical: 2,
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 6,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        width: "47%",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    cardImage: {
        width: "100%",
        height: 150,
        borderRadius: 6,
        marginBottom: 6,
    },
    cardTitle: {
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
        color: "#333",
    },
    cardDesc: {
        textAlign: "center",
        fontSize: 13,
        color: "#555",
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginVertical: 10,
    },
});
