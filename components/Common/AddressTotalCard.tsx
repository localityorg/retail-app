import React from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

import { View, BoldText } from "./Themed";

interface CardProps {
	deliveryAddress: any;
	onPress: any;
	disabled: boolean;
	grandTotal: string;
	loading: boolean;
}

export default function AddressTotalCard(props: CardProps) {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.section}
				onPress={props.onPress}
				disabled={props.disabled}
			>
				<BoldText style={styles.sectionHeader}>Address</BoldText>
				{props.deliveryAddress && (
					<BoldText
						style={{
							fontSize: 14,
						}}
						numberOfLines={props.disabled ? 2 : 3}
					>
						{props.deliveryAddress.line1},{" "}
						{props.deliveryAddress.line2}
					</BoldText>
				)}
			</TouchableOpacity>
			<View style={styles.seperator} />
			<View style={styles.section}>
				<BoldText style={styles.sectionHeader}>Grand Total</BoldText>
				{props.loading ? (
					<ActivityIndicator color="#1ea472" style={{ height: 22 }} />
				) : (
					<BoldText
						style={{
							fontSize: 20,
						}}
					>
						₹ {props.grandTotal}/-
					</BoldText>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#555",
		flexDirection: "row",
		alignItems: "flex-start",
		padding: 10,
	},
	section: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
	},
	seperator: {
		alignSelf: "center",
		height: "80%",
		width: 1,
		backgroundColor: "#111",
		marginHorizontal: 10,
	},
	sectionHeader: {
		fontSize: 15,
		marginBottom: 5,
		color: "#666",
		textTransform: "uppercase",
	},
});
