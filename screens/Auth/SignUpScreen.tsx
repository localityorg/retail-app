import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
	StatusBar,
} from "react-native";

import * as Location from "expo-location";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";

import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../../components/Common/Elements";
import { BoldText, Text, TextInput } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";
import ResendOTP from "../../components/Common/ResendOTP";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

import { AuthContext } from "../../context/auth";
import { setUser } from "../../redux/actions";

import { REGISTER_USER } from "../../graphql/userdefs";
import { TWOFACTOR_AUTH, CHECK_AUTH } from "../../graphql/authdefs";
import Input from "../../components/Common/Input";

const SignUpScreen = () => {
	const [values, setValues] = useState({
		name: "",
		vendor: true,
	});
	const [ISD, setISD] = useState("+91");
	const [number, setNumber] = useState("");

	const colorScheme = useColorScheme();
	const [message, setMessage] = useState<string | null>(null);
	const [code, setCode] = useState<string>("");
	const [location, setLocation] = useState<object | null>(null);
	const [screenState, setScreenState] = useState(0);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const context = useContext(AuthContext);
	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);

	const askForLocationPermission = () => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});
				setLocation({
					latitude: location.coords.latitude.toString(),
					longitude: location.coords.longitude.toString(),
				});
			}
		})();
	};

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		variables: {
			...values,
			coordinates: location,
			ISD: ISD,
			number: number,
		},
		onCompleted(data) {
			dispatch(setUser(data.register));
			context.login({
				id: data.register.id,
				vendor: data.register.vendor,
				token: data.register.token,
				refreshToken: data.register.refreshToken,
			});
		},
		onError(error) {
			Alert.alert("Seems to be a problem!", `${error}`);
		},
	});

	const [twoFactorAuth, { data: twoFactorData, loading: tfaLoading }] =
		useLazyQuery(TWOFACTOR_AUTH, {
			variables: {
				contact: number,
				newAcc: true,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.twoFactorAuth.error
					? setMessage("Account with this contact does not exist.")
					: setScreenState(screenState + 1);
			},
			onError(err) {
				Alert.alert(`Seems like a problem`, `${err}`, [
					{
						text: "Try Again",
						onPress: () => setNumber(""),
						style: "cancel",
					},
				]);
			},
		});

	const [checkAuth] = useLazyQuery(CHECK_AUTH, {
		variables: {
			contact: number,
			secureCode: code,
		},
		fetchPolicy: "no-cache",
		onCompleted(data) {
			data.checkAuth.error
				? setMessage(data.checkAuth.errorMsg)
				: setScreenState(screenState + 1);
		},
		onError(err) {
			console.log(err);
		},
	});

	useEffect(() => {
		screenState === 3 && askForLocationPermission();
	}, [screenState]);

	const onSubmit = () => {
		addUser({
			variables: {
				...values,
				coordinates: location,
				ISD: ISD,
				number: number,
			},
		});
		setMessage(null);
	};

	function handleContactConfirm() {
		setMessage(null);
		if (number.length === 10) {
			twoFactorAuth({
				variables: {
					contact: number,
					newAcc: true,
				},
			});
		}
	}

	const handleCancel = () => {
		setScreenState(0);
		setMessage(null);
	};

	const navBack = () => {
		setMessage(null);
		setScreenState(0);
		navigation.navigate("Login");
	};

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				{screenState === 0 && (
					<View style={styles.mainContainer}>
						<View style={styles.artContainer}>
							<View
								style={{
									...CommonStyles.header,
									width: "90%",
									alignSelf: "center",
								}}
							>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("Onboarding")
									}
								>
									<AntDesign
										name="back"
										size={25}
										color={Colors[colorScheme].text}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.actionsContainer}>
							<BoldText style={styles.title}>
								Make a new account
							</BoldText>
							<Text style={styles.contentText}>
								Enter your 10 digit phone number below
							</Text>
							<View style={styles.contactContainer}>
								<TextInput
									placeholder="Contact No."
									value={number}
									onChangeText={(text) => setNumber(text)}
									keyboardType="phone-pad"
									style={styles.contactInput}
									selectionColor="#1ea372"
								/>
								<TouchableOpacity
									style={styles.contactSubmitBtn}
									disabled={tfaLoading || number.length <= 9}
									onPress={() => handleContactConfirm()}
								>
									{tfaLoading ? (
										<ActivityIndicator color="#1ea472" />
									) : (
										<Ionicons
											name="chevron-forward-outline"
											color="#1ea472"
											size={24}
										/>
									)}
								</TouchableOpacity>
							</View>
							<View style={styles.linkBtnContainer}>
								<Text style={styles.linkBtnText}>
									Returning User?
								</Text>
								<TouchableOpacity
									disabled={loading}
									onPress={() => navBack()}
								>
									<Text
										style={{
											...styles.linkBtnText,
											color: "#1ea372",
											marginLeft: 5,
										}}
									>
										Log In
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
				{screenState === 1 && number.length === 10 && (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() => {
									setScreenState(0);
									setNumber("");
								}}
							>
								<AntDesign
									name="back"
									size={25}
									color={Colors[colorScheme].text}
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.contentContainer}>
							<BoldText style={styles.title}>
								Contact Verification
							</BoldText>
							<Text style={styles.contentText}>
								Enter OTP (One Time Password) sent on your
								number below
							</Text>

							<View
								style={{
									width: "90%",
									alignSelf: "center",
									flexDirection: "column",
								}}
							>
								<OTPInputView
									style={{
										width: "100%",
										height: 100,
										alignSelf: "center",
									}}
									code={code}
									onCodeChanged={(text) => setCode(text)}
									pinCount={6}
									keyboardType="phone-pad"
									autoFocusOnLoad
									placeholderTextColor={
										Colors[colorScheme].placeholder
									}
									codeInputFieldStyle={{
										...otpInputStyles.underlineStyleBase,
										color: Colors[colorScheme].text,
									}}
									codeInputHighlightStyle={
										otpInputStyles.underlineStyleHighLighted
									}
									onCodeFilled={(code) => {
										checkAuth({
											variables: {
												contact: number,
												secureCode: code,
											},
										});
									}}
								/>
								<ResendOTP
									date={twoFactorData?.twoFactorAuth.date}
									number={number}
									newAcc={true}
									setCode={() => setCode("")}
								/>
							</View>
						</View>
						{message && (
							<View style={CommonStyles.errorContainer}>
								<Text style={CommonStyles.errorText}>
									{message}
								</Text>
							</View>
						)}
					</View>
				)}
				{screenState === 2 && (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header} />
						<View style={styles.contentContainer}>
							<BoldText style={CommonStyles.title}>
								Set up your Account
							</BoldText>
							<Text style={styles.contentText}>
								What should we call you?
							</Text>
							<Input
								title="Name"
								placeholder="Your Name"
								value={values.name}
								onChange={(text: string) =>
									setValues({ ...values, name: text })
								}
								selectionColor="#1ea372"
								error={false}
								errorMessage="Name must be valid"
							/>
						</View>
						<View style={styles.nextBtnContainer}>
							<TouchableOpacity
								style={styles.nextBtnP}
								onPress={() => handleCancel()}
							>
								<Text style={styles.nextBtnPText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.nextBtnS}
								onPress={() => setScreenState(screenState + 1)}
							>
								<Ionicons
									name="chevron-forward-outline"
									color="#fff"
									size={30}
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{screenState === 3 && (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header} />
						<View style={styles.contentContainer}>
							<BoldText style={CommonStyles.title}>
								Enable Location service
							</BoldText>
							<Text
								style={{ ...styles.contentText, width: "90%" }}
							>
								Location service helps us estimate delivery time
								for you and detect nearest delivery partners to
								your store.
							</Text>
						</View>
						<View style={styles.nextBtnContainer}>
							<TouchableOpacity
								style={styles.nextBtnP}
								onPress={() => handleCancel()}
							>
								<Text style={styles.nextBtnPText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.nextBtnS}
								onPress={() => setScreenState(screenState + 1)}
								disabled={location === null ? true : false}
							>
								<Ionicons
									name="chevron-forward-outline"
									color="#fff"
									size={30}
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{screenState === 4 && (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header} />
						<View style={styles.contentContainer}>
							<BoldText style={CommonStyles.title}>
								All Set!
							</BoldText>
						</View>
						<View style={styles.submitBtnContainer}>
							<ActionBtn
								disable={loading}
								onPress={onSubmit}
								disabled={loading}
							>
								<ActionBtnText>
									{loading ? (
										<ActivityIndicator color="#fff" />
									) : (
										"Register"
									)}
								</ActionBtnText>
							</ActionBtn>
							<SecondaryActionBtn
								onPress={() => navigation.navigate("SignUp")}
								activeOpacity={0.8}
								disable={true}
								style={{ backgroundColor: "transparent" }}
							>
								<SecondaryActionBtnText>
									<BoldText style={{ color: "#1ea472" }}>
										New user?
									</BoldText>{" "}
									Sign Up
								</SecondaryActionBtnText>
							</SecondaryActionBtn>
						</View>
					</View>
				)}
			</View>
		</>
	);
};

export default SignUpScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: "100%",
		alignItems: "center",
	},
	actionsContainer: {
		flexDirection: "column",
		width: "90%",
		paddingVertical: "5%",
	},
	artContainer: {
		flex: 1,
		backgroundColor: "#1ea47222",
		width: "100%",
	},
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
	linkBtnText: {
		color: "#777",
		fontSize: 14,
	},
	linkBtnContainer: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
		marginTop: 10,
	},
	checkboxContainer: {
		width: "100%",
		marginBottom: 5,
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	checkboxText: {
		fontSize: 20,
		color: "#999",
		marginLeft: 10,
	},
	contentContainer: {
		flexDirection: "column",
		flex: 1,
		width: "96%",
	},
	title: {
		fontSize: 25,
		marginBottom: 10,
	},
	contentText: {
		fontSize: 18,
		color: "#888",
		width: "70%",
	},
	inputContainer: {
		flexDirection: "row",
		width: "100%",
	},
	input: {
		fontSize: 18,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#888",
		width: "100%",
		padding: 10,
	},
	nextBtnContainer: {
		marginBottom: 20,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	nextBtnP: {
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		backgroundColor: "transparent",
	},
	nextBtnPText: {
		fontSize: 16,
		color: "#888",
	},
	nextBtnS: {
		height: 60,
		width: 60,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: "#1ea472",
		backgroundColor: "#1ea472",
	},
	nextBtnSText: {
		color: "#1ea472",
		fontSize: 18,
	},
	submitBtnContainer: {
		marginBottom: 20,
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	submitBtnP: {
		height: 50,
		width: "90%",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#1ea472",
		marginBottom: 10,
	},
	submitBtnPText: {
		fontSize: 16,
		color: "#fff",
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
