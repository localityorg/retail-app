import React from "react";
import styled from "styled-components/native";
import { Text, View } from "./Themed";
import { ActivityIndicator, StatusBar, StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		backgroundColor: "transparent",
	},
	// header bar
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: StatusBar.currentHeight,
	},
	mainContainer: {
		flex: 1,
		width: "90%",
		alignItems: "center",
		flexDirection: "column",
	},
	header: {
		width: "100%",
		height: 70,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	screenTitle: {
		marginVertical: 10,
	},
	title: {
		fontSize: 30,
	},
	// error container
	errorContainer: {
		width: "95%",
		padding: 10,
		alignSelf: "center",
		borderRadius: 10,
		alignItems: "center",
		height: 50,
		justifyContent: "center",
		marginVertical: 5,
	},
	errorText: {
		color: "#dd0000",
		fontSize: 14,
		textAlign: "center",
	},
	seperator: {
		width: "90%",
		height: 1,
		backgroundColor: "#ddd",
		marginVertical: 10,
		alignSelf: "center",
	},
	actionBtnContainer: {
		width: "90%",
		alignSelf: "center",
		alignItems: "center",
		paddingVertical: "5%",
	},
	// section styles
	section: {
		flexDirection: "column",
		width: "100%",
		marginBottom: 15,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "transparent",
	},
	sectionHeader: { fontSize: 16, marginBottom: 5 },
	sectionText: { fontSize: 14, marginBottom: 5 },
	sectionInput: {
		width: "100%",
		fontSize: 16,
		padding: 10,
		borderBottomColor: "#1ea47255",
		borderBottomWidth: 1,
		marginBottom: 5,
	},
	sectionRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 5,
	},
});

export const CartSheetStyles = StyleSheet.create({
	inventoryProduct: {
		width: "100%",
		alignSelf: "center",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 5,
		backgroundColor: "transparent",
	},
	rowContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "transparent",
	},
	quantityText: {
		color: "#fff",
		marginHorizontal: 10,
	},
	productName: {
		color: "#222",
	},
	productMeta: {
		color: "#444",
	},
	itemQuantity: {
		marginLeft: 15,
		height: 40,
		width: 40,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#111",
	},
});

interface ActionBtnProps {
	disable: boolean;
}

export const ActionBtn = styled.TouchableOpacity`
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	align-items: center;
	height: 50px;
	justify-content: center;
	background-color: ${(props: ActionBtnProps) =>
		props.disable ? "#555" : "#1ea372"};
`;

export const ActionBtnText = styled(Text)`
	font-size: 16px;
	color: #fff;
`;

interface SecondaryActionBtnProps {
	disable: boolean;
}

export const SecondaryActionBtn = styled.TouchableOpacity`
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	align-items: center;
	height: 50px;
	justify-content: center;
	background-color: ${(props: SecondaryActionBtnProps) =>
		props.disable ? "#ddd" : "#333"};
`;

export const SecondaryActionBtnText = styled(Text)`
	font-size: 16px;
`;

interface CategoryBtnProps {
	active: boolean;
}

export const CategoryBtn = styled.TouchableOpacity`
	border-radius: 10px;
	border-color: #1ea472;
	border-width: 1px;
	background-color: ${(props: CategoryBtnProps) =>
		props.active ? "#1ea372" : "transparent"};
	padding: 5px;
	padding-left: 7px;
	padding-right: 7px;
	margin-right: 7px;
	margin-bottom: 5px;
`;

export const CategoryBtnText = styled.Text`
	color: ${(props: CategoryBtnProps) => (props.active ? "#fff" : "#1ea472")};
`;

export const LoadingContainer = () => {
	return (
		<View style={CommonStyles.loadingContainer}>
			<ActivityIndicator color="#1ea472" size="large" />
		</View>
	);
};
