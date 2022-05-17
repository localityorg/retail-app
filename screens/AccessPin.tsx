import React, { useState } from "react";
import { StyleSheet, StatusBar, View, TouchableOpacity } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import { BoldText, Text } from "../components/Common/Themed";
import { CommonStyles } from "../components/Common/Elements";

import Colors from "../constants/Colors";

import { setPinState } from "../redux/actions";
import useColorScheme from "../hooks/useColorScheme";

import { RootTabScreenProps } from "../types";

export default function AccessPin({
	navigation,
}: RootTabScreenProps<"AccessPin">) {
	const colorScheme = useColorScheme();
	const [message, setMessage] = useState<string | null>(null);
	const [code, setCode] = useState("");
	const dispatch = useDispatch();

	const { store } = useSelector((state: any) => state.storeReducer);

	const checkAuth = () => {
		const storePin = store.accessPin;
		if (storePin === code) {
			dispatch(setPinState(true));
			navigation.navigate("AllOrders");
		} else {
			setMessage("Access Pin Incorrect");
		}
	};

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("ProfileScreen")}
						>
							<AntDesign
								name="back"
								size={25}
								color={Colors[colorScheme].text}
							/>
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Access Pin
							</BoldText>
						</View>
					</View>
					<Text style={styles.textStyle}>
						Enter your 6 digit access code to access next screen{" "}
					</Text>
					<OTPInputView
						style={{
							width: "90%",
							height: 100,
							alignSelf: "center",
						}}
						code={code}
						onCodeChanged={(text) => {
							message !== null && setMessage(null);
							setCode(text);
						}}
						pinCount={6}
						keyboardType="phone-pad"
						autoFocusOnLoad
						codeInputFieldStyle={otpInputStyles.underlineStyleBase}
						codeInputHighlightStyle={
							otpInputStyles.underlineStyleHighLighted
						}
						onCodeFilled={(code) => {
							checkAuth();
						}}
					/>
				</View>
				{message && (
					<View style={CommonStyles.errorContainer}>
						<Text style={CommonStyles.errorText}>{message}</Text>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	urlText: {
		textDecorationLine: "underline",
		color: "#888",
		marginLeft: 10,
	},
	textStyle: {
		fontSize: 16,
		marginBottom: 10,
		textAlign: "center",
	},
});

const otpInputStyles = StyleSheet.create({
	underlineStyleBase: {
		width: 30,
		height: 45,
		color: "#111",
		fontSize: 20,
		borderWidth: 0,
		borderBottomWidth: 2,
	},
	underlineStyleHighLighted: {
		borderColor: "#1ea472",
	},
});
