import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";

import { BoldText, View, Text } from "../../components/Common/Themed";

interface ProductInfoToastProps {
	message: any;
}

export function ProductInfoToast(props: ProductInfoToastProps) {
	return (
		<KeyboardAvoidingView style={styles.toastContainer} behavior="height">
			<View style={styles.toastTexts}>
				{props.message.displayMessage.length !== 0 ? (
					<BoldText>{props.message.displayMessage}</BoldText>
				) : (
					<BoldText style={styles.toastText}>
						Product doesnt exist yet
					</BoldText>
				)}
				<Text style={styles.toastText}>
					{props.message.displaySubMessage}
				</Text>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	toastContainer: {
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#00990011",
		padding: 10,
		borderRadius: 10,
		marginBottom: 20,
	},
	toastTexts: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-start",
		backgroundColor: "transparent",
	},
	toastText: {
		color: "#009900",
	},
});
