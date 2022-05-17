import React from "react";
import { View, Text, BoldText } from "../components/Common/Themed";

const ToastView = (props: any) => {
	return (
		<View
			style={{
				borderRadius: 10,
				marginVertical: 10,
				width: "100%",
				overflow: "hidden",
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.25,
				shadowRadius: 3.84,

				elevation: 5,
			}}
		>
			{props.children}
		</View>
	);
};

export const toastConfig = {
	success: ({ text1, text2 }: any) => (
		<ToastView>
			<View
				style={{
					padding: 10,
					width: "100%",
					paddingHorizontal: 15,
					backgroundColor: "#1ea47233",
				}}
			>
				<BoldText>{text1}</BoldText>
				<Text>{text2}</Text>
			</View>
		</ToastView>
	),

	error: ({ text1, text2 }: any) => (
		<ToastView>
			<View
				style={{
					padding: 10,
					width: "100%",
					paddingHorizontal: 15,
					backgroundColor: "#dd000033",
				}}
			>
				<BoldText>{text1}</BoldText>
				<Text>{text2}</Text>
			</View>
		</ToastView>
	),
};
