import React from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../../components/Common/Themed";

interface ActionsOnProductProps {
	number: string;
	preText?: string;
	postText?: string;
	onPressPost?: any;
	onChange: any;
	onPressAdd: any;
	onPressMinus: any;
	limit?: number;
	fontSize?: number;
}

export function Counter(props: ActionsOnProductProps) {
	return (
		<View style={styles.productCount}>
			<TouchableOpacity delayPressIn={0} onPress={props.onPressAdd}>
				<Ionicons name="add-outline" size={25} color="#111" />
			</TouchableOpacity>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginHorizontal: 10,
				}}
			>
				{props.preText && (
					<TouchableOpacity disabled={true}>
						<Text
							style={{
								fontSize: props.fontSize || 16,
								marginRight: 8,
							}}
						>
							{props.preText}
						</Text>
					</TouchableOpacity>
				)}
				<TextInput
					value={props.number}
					onChangeText={props.onChange}
					keyboardType="phone-pad"
					style={{ fontSize: props.fontSize || 16, paddingLeft: 0 }}
				/>
				{props.postText && (
					<TouchableOpacity onPress={props.onPressPost}>
						<Text
							style={{
								fontSize: props.fontSize || 16,
								marginLeft: 8,
							}}
						>
							{props.postText}
						</Text>
					</TouchableOpacity>
				)}
			</View>
			<TouchableOpacity
				delayPressIn={0}
				disabled={parseFloat(props.number) <= 0}
				onPress={props.onPressMinus}
			>
				<Ionicons name="remove-outline" size={25} color="#111" />
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	productCount: {
		width: "40%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		height: 50,
		padding: 10,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
	},
	count: {
		flex: 1,
		fontSize: 16,
	},
});
