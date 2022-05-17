import React from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { View, Text } from "../../components/Common/Themed";

interface ActionsOnProductProps {
	productValue: any;
	addLoading: boolean;
	setProductValue: any;
	onPressAddToInventory: any;
}

export function ActionsOnProduct(props: ActionsOnProductProps) {
	return (
		<View style={styles.actionContainer}>
			<View style={styles.productCount}>
				<TouchableOpacity
					disabled={
						parseFloat(props.productValue.itemQuantity) >= 500
					}
					delayPressIn={0}
					onPress={() =>
						props.setProductValue({
							...props.productValue,
							itemQuantity: (
								parseFloat(props.productValue.itemQuantity) + 1
							).toString(),
						})
					}
				>
					<Ionicons
						name="add-outline"
						size={25}
						color={
							parseFloat(props.productValue.itemQuantity) >= 0
								? "#777"
								: "#111"
						}
					/>
				</TouchableOpacity>
				<Text style={styles.count}>
					{parseFloat(props.productValue.itemQuantity)}
				</Text>
				<TouchableOpacity
					delayPressIn={0}
					disabled={parseFloat(props.productValue.itemQuantity) <= 0}
					onPress={() =>
						props.setProductValue({
							...props.productValue,
							itemQuantity: (
								parseFloat(props.productValue.itemQuantity) - 1
							).toString(),
						})
					}
				>
					<Ionicons name="remove-outline" size={25} color="#111" />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={{
					...styles.actionBtn,
					flex: 1,
					backgroundColor:
						parseFloat(props.productValue.itemQuantity) <= 0
							? "#ddd"
							: "#1ea472",
				}}
				activeOpacity={0.8}
				disabled={parseFloat(props.productValue.itemQuantity) <= 0}
				onPress={props.onPressAddToInventory}
			>
				{props.addLoading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text style={styles.actionBtnText}>Add to Inventory</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	actionContainer: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingBottom: 10,
	},
	productCount: {
		width: "40%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: 10,
		height: 50,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		marginRight: "5%",
	},
	count: {
		fontSize: 16,
	},
	actionBtn: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		height: 50,
		backgroundColor: "#1ea372",
		borderRadius: 10,
	},
	actionBtnText: {
		color: "#fff",
		fontSize: 16,
	},
});
