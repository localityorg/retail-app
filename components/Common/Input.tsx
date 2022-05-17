import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { View, Text, TextInput, BoldText } from "./Themed";
import { CommonStyles } from "./Elements";

interface InputProps {
	title: string;
	placeholder: string;
	value: string;
	onChange: any;
	error?: boolean;
	errorMessage?: string;
	constraint?: any;
	maxLength?: number;
	autoFocus?: boolean;
	autoCapitalize?: string;
	keyboardType?: string;
	autoCorrect?: boolean;
	mini?: boolean;
	search?: boolean;
}

export default function Input(props: InputProps) {
	const [focus, setFocus] = useState(false);

	return (
		<View
			style={{
				...styles.inputContainer,
				width: props.mini ? "50%" : "100%",
				marginRight: props.mini ? 10 : 0,
			}}
		>
			<BoldText
				style={{
					...styles.inputTitle,
					color: focus ? "#1ea472" : "#1ea47288",
				}}
			>
				{props.title}
			</BoldText>
			<View
				style={{
					...styles.inputStyle,
					borderBottomColor: focus ? "#1ea472" : "#1ea47288",
				}}
			>
				<TextInput
					placeholder={props.placeholder}
					value={props.value}
					onChangeText={(text) => props.onChange(text)}
					style={{
						flex: 1,
						marginRight: 10,
						fontSize: 18,
					}}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
				/>
				{/* <ActivityIndicator/> */}
			</View>
			{props.error && (
				<View style={CommonStyles.errorContainer}>
					<Text style={CommonStyles.errorText}>
						{props.errorMessage}
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		width: "100%",
		marginBottom: 10,
		backgroundColor: "transparent",
		marginVertical: 5,
	},
	inputStyle: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		paddingLeft: 0,
		marginBottom: 5,
		paddingTop: 0,
		paddingHorizontal: 10,
		fontSize: 18,
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "transparent",
		borderBottomColor: "#1ea47255",
	},
	inputTitle: {
		color: "#1ea472",
	},
	errorText: {
		marginLeft: 10,
		color: "#d00",
	},
});
