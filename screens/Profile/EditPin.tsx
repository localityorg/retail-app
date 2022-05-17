import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";

import OTPInputView from "@twotalltotems/react-native-otp-input";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import {
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import { BoldText, Text } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";

import {
	CHECK_AUTH,
	SET_ACCESS_PIN,
	TWOFACTOR_AUTH,
} from "../../graphql/authdefs";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

import { RootTabScreenProps } from "../../types";

export default function EditPin({ navigation }: RootTabScreenProps<"EditPin">) {
	const colorScheme = useColorScheme();
	const [message, setMessage] = useState<string | null>(null);
	const [code, setCode] = useState("");
	const [otp, setOtp] = useState("");
	const [success, setSuccess] = useState(false);

	const { user } = useSelector((state: any) => state.userReducer);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	// snap points
	const largeSnapPoints = useMemo(() => ["50%"], []);

	// callbacks
	const handleSheetChanges = useCallback(() => {}, []);

	function showToast(message1: string, message2: string, type: number) {
		Toast.show({
			type: type === 1 ? "success" : "error",
			text1: message1,
			text2: message2,
		});
	}

	const [setAccessPin, { loading }] = useMutation(SET_ACCESS_PIN, {
		variables: { accessPin: code.toString() },
		onCompleted(data) {
			if (data.setAccessPin) {
				setOtp("");
				setCode("");
				showToast(
					"Pin Confirmed!",
					"Your Access pin is set successfully.",
					1
				);
				setMessage(null);
				setSuccess(true);
				navigation.navigate("ProfileScreen");
			} else {
				showToast(
					"Oops!",
					"Couldn't set the pin. Try again in some time.",
					0
				);
			}
		},
	});

	const [twoFactorAuth, { loading: tfaLoading }] = useLazyQuery(
		TWOFACTOR_AUTH,
		{
			variables: {
				contact: user?.contact,
				newAcc: false,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.twoFactorAuth.error
					? setMessage("Account with this contact does not exist.")
					: bottomSheetModalRef.current?.present();
			},
			onError(err) {
				console.log(err);
			},
		}
	);

	const [check2FAuth, { loading: ctfaLoading }] = useLazyQuery(CHECK_AUTH, {
		variables: {
			contact: user?.contact,
			secureCode: otp,
		},
		fetchPolicy: "no-cache",
		onCompleted(data) {
			if (data.checkAuth.error) {
				setMessage(
					"6 digit code does not match. Try Again or Resend code"
				);
			} else {
				bottomSheetModalRef.current?.close();
				setAccessPin();
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	// TODO: change ui of success redirecting
	if (loading || tfaLoading || ctfaLoading) {
		return (
			<>
				<DynamicStatusBar />
				<LoadingContainer />
			</>
		);
	}

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={largeSnapPoints}
				onChange={handleSheetChanges}
				key={990948383}
				style={{
					borderRadius: 20,
				}}
			>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
						padding: 10,
						borderRadius: 15,
						backgroundColor: "#fff",
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-start",
							padding: 5,
							marginBottom: 5,
						}}
					>
						<BoldText style={{ fontSize: 18 }}>
							Contact Verification
						</BoldText>
					</View>
					<Text
						style={{
							fontSize: 16,
							color: "#555",
							textAlign: "center",
						}}
					>
						To verify changes, enter 6 digit code sent to your
						registered number
					</Text>
					<OTPInputView
						style={{
							width: "90%",
							height: 100,
							alignSelf: "center",
						}}
						key={123456789}
						code={otp}
						onCodeChanged={(text) => setOtp(text)}
						pinCount={6}
						keyboardType="phone-pad"
						autoFocusOnLoad
						codeInputFieldStyle={otpInputStyles.underlineStyleBase}
						codeInputHighlightStyle={
							otpInputStyles.underlineStyleHighLighted
						}
						onCodeFilled={(code) => {
							check2FAuth({
								variables: {
									contact: user?.contact,
									secureCode: code,
								},
							});
						}}
					/>
				</View>
			</BottomSheetModal>
			<DynamicStatusBar />
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
								Edit Pin
							</BoldText>
						</View>
					</View>
					<Text style={styles.textStyle}>
						Set 6 digit pin to restrict screens of your store
					</Text>
					<Text style={styles.textStyle}>
						NOTE: Only store owner can change/set access pin.
					</Text>
					{/* TODO: Create common component for this */}
					{code.length !== 6 && (
						<OTPInputView
							style={{
								width: "90%",
								height: 100,
								alignSelf: "center",
							}}
							key={987654321}
							code={code}
							onCodeChanged={(code) => setCode(code)}
							pinCount={6}
							keyboardType="phone-pad"
							autoFocusOnLoad
							codeInputFieldStyle={
								otpInputStyles.underlineStyleBase
							}
							codeInputHighlightStyle={
								otpInputStyles.underlineStyleHighLighted
							}
							onCodeFilled={(code) => {
								Alert.alert(
									"Confirm Pin",
									`Store's 6 digit access pin is about to be ${code}`,
									[
										{
											text: "Confirm",
											onPress: () =>
												twoFactorAuth({
													variables: {
														contact: user?.contact,
														newAcc: false,
													},
												}),
										},
										{
											text: "Cancel",
											onPress: () => {
												setCode("");
											},
										},
									]
								);
							}}
						/>
					)}
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
		width: "80%",
		alignSelf: "flex-start",
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
