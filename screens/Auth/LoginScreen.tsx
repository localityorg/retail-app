import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { BoldText, Text, TextInput } from "../../components/Common/Themed";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
	CommonStyles,
	ActionBtn,
	ActionBtnText,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../../components/Common/Elements";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { AuthContext } from "../../context/auth";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/actions";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import DynamicStatusBar from "../../components/Common/StatusBar";

import { LOGIN_USER } from "../../graphql/userdefs";
import { TWOFACTOR_AUTH, CHECK_AUTH } from "../../graphql/authdefs";
import ResendOTP from "../../components/Common/ResendOTP";

const LoginScreen = () => {
	const navigation = useNavigation();
	const context = useContext(AuthContext);
	const colorScheme = useColorScheme();
	const dispatch = useDispatch();

	const [message, setMessage] = useState<any | string>(null);
	const [contact, setContact] = useState("");
	const [sentForConfirmation, setSentForConfirmation] = useState(false);
	const [code, setCode] = useState<string>("");

	const [loginUser, { error, loading }] = useMutation(LOGIN_USER, {
		variables: { contact },
		onError(err) {
			setMessage("Error occured, try again!");
			console.log(err);
		},
		onCompleted(data) {
			if (data.login.vendor) {
				setMessage(null);
				setCode("");
				setContact("");
				setSentForConfirmation(false);
				dispatch(setUser(data.login));
				context.login({
					id: data.login.id,
					vendor: data.login.vendor,
					token: data.login.token,
					refreshToken: data.login.refreshToken,
				});
			} else {
				setMessage("Account doesnt belong to a vendor.");
			}
		},
	});

	const [twoFactorAuth, { data: twoFactorData, loading: tfaLoading }] =
		useLazyQuery(TWOFACTOR_AUTH, {
			variables: {
				contact,
				newAcc: false,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				if (data.twoFactorAuth.error) {
					setContact("");
					setMessage(data.twoFactorAuth.message);
				} else {
					setSentForConfirmation(true);
				}
			},
		});

	const [checkAuth, { data: authData, loading: authLoading }] = useLazyQuery(
		CHECK_AUTH,
		{
			variables: {
				contact,
				secureCode: code,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.checkAuth.error
					? setMessage(
							"6 digit code does not match. Try Again or Resend code"
					  )
					: onSubmit();
			},
			onError(err) {
				console.log(err);
			},
		}
	);

	useEffect(() => {
		if (error) {
			Alert.alert("Error Occured!", "Wrong Credentials, try again.");
		}
	}, [error]);

	const onSubmit = () => {
		setMessage(null);
		loginUser({ variables: { contact: contact } });
	};

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("Onboarding")}
						>
							<AntDesign
								name="back"
								size={25}
								color={Colors[colorScheme].text}
							/>
						</TouchableOpacity>
					</View>
					<BoldText style={styles.title}>Welcome Back!</BoldText>
					<Text style={styles.contentText}>
						{!sentForConfirmation
							? "Log into your store!"
							: `Enter 6-digit code sent to your registered number below`}
					</Text>
					{!sentForConfirmation ? (
						<View style={styles.contactContainer}>
							<TextInput
								placeholder="Contact No."
								value={contact}
								onChangeText={(text) => {
									message !== null && setMessage(null);
									setContact(text);
								}}
								style={styles.contactInput}
								placeholderTextColor={
									Colors[colorScheme].placeholder
								}
								textContentType="telephoneNumber"
								autoFocus={true}
								keyboardType="phone-pad"
								selectionColor="#1ea472"
							/>
							{contact.length === 10 && (
								<TouchableOpacity
									style={styles.contactSubmitBtn}
									disabled={
										tfaLoading || contact.length !== 10
									}
									onPress={() =>
										twoFactorAuth({
											variables: {
												contact,
												newAcc: false,
											},
										})
									}
								>
									{tfaLoading === true ? (
										<ActivityIndicator color="#1ea472" />
									) : (
										<Ionicons
											name="chevron-forward-outline"
											size={24}
											color="#1ea472"
										/>
									)}
								</TouchableOpacity>
							)}
						</View>
					) : (
						<View
							style={{
								flexDirection: "column",
								width: "90%",
								alignSelf: "center",
							}}
						>
							<OTPInputView
								style={{
									width: "100%",
									height: 100,
								}}
								code={code}
								onCodeChanged={(text) => setCode(text)}
								pinCount={6}
								keyboardType="phone-pad"
								key={1034939481}
								autoFocusOnLoad
								codeInputFieldStyle={
									otpInputStyles.underlineStyleBase
								}
								placeholderTextColor={
									Colors[colorScheme].placeholder
								}
								codeInputHighlightStyle={
									otpInputStyles.underlineStyleHighLighted
								}
								onCodeFilled={(code) => {
									message !== null && setMessage(null);
									checkAuth({
										variables: {
											contact,
											secureCode: code,
										},
									});
								}}
							/>
							<ResendOTP
								number={contact}
								date={twoFactorData?.twoFactorAuth.date}
								newAcc={false}
								setCode={() => setCode("")}
							/>
						</View>
					)}
				</View>
				<View style={CommonStyles.actionBtnContainer}>
					{message && (
						<View style={CommonStyles.errorContainer}>
							<Text style={CommonStyles.errorText}>
								{message}
							</Text>
						</View>
					)}
					{sentForConfirmation ? (
						<ActionBtn
							disabled={
								!authData?.checkAuth?.status ||
								loading ||
								authLoading ||
								code.length < 6
									? true
									: false
							}
							onPress={onSubmit}
							disable={
								!authData?.checkAuth?.status || code.length < 6
									? true
									: false
							}
						>
							<ActionBtnText>
								{loading || authLoading ? (
									<ActivityIndicator color="#fff" />
								) : (
									"Log In"
								)}
							</ActionBtnText>
						</ActionBtn>
					) : (
						<SecondaryActionBtn
							onPress={() => navigation.navigate("SignUp")}
							activeOpacity={0.8}
							disable={true}
							disabled={loading}
							style={{ backgroundColor: "transparent" }}
						>
							<SecondaryActionBtnText>
								<BoldText style={{ color: "#1ea472" }}>
									New user?
								</BoldText>{" "}
								Sign Up
							</SecondaryActionBtnText>
						</SecondaryActionBtn>
					)}
				</View>
			</View>
		</>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	contactContainer: {
		width: "100%",
		height: 50,
		backgroundColor: "transparent",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#ddd",
		flexDirection: "row",
		alignItems: "center",
		overflow: "hidden",
		marginVertical: "5%",
	},
	contactInput: {
		fontSize: 18,
		padding: 10,
		flex: 1,
	},
	contactSubmitBtn: {
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: 50,
		backgroundColor: "transparent",
	},
	input: {
		fontSize: 20,
		padding: 10,
		marginBottom: 5,
		color: "#111111",
		width: "95%",
	},
	actionContainer: {
		position: "absolute",
		bottom: 0,
		width: "90%",
		paddingBottom: 10,
		marginVertical: 10,
		alignItems: "center",
		flexDirection: "column",
	},
	linkBtnText: {
		fontSize: 14,
	},
	linkBtnContainer: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
	},
	title: {
		fontSize: 25,
		alignSelf: "flex-start",
		marginBottom: 10,
	},
	contentText: {
		fontSize: 18,
		alignSelf: "flex-start",
		color: "#888",
		width: "90%",
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
