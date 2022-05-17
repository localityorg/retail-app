import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import {
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	Keyboard,
	Alert,
} from "react-native";

import OTPInputView from "@twotalltotems/react-native-otp-input";
import deepDiffer from "react-native/Libraries/Utilities/differ/deepDiffer";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { BoldText, Text, View } from "../../components/Common/Themed";
import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import ResendOTP from "../../components/Common/ResendOTP";
import DynamicStatusBar from "../../components/Common/StatusBar";
import DeleteBtn from "../../components/Profile/DeleteAccount";
import Input from "../../components/Common/Input";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

import { setUser } from "../../redux/actions";
import useColorScheme from "../../hooks/useColorScheme";

import { EDIT_PROFILE } from "../../graphql/userdefs";
import { CHECK_AUTH, TWOFACTOR_AUTH } from "../../graphql/authdefs";

import { RootTabScreenProps } from "../../types";

export default function ManageInformation({
	navigation,
}: RootTabScreenProps<"ManageInformation">) {
	const [userState, setUserState] = useState<any>(null);
	const [message, setMessage] = useState<string | any>(null);
	const [isntSame, setIsntSame] = useState<boolean>(true);
	const [code, setCode] = useState<string>("");
	const [viewModal, setViewModal] = useState<boolean>(false);
	const [verified, setVerified] = useState<boolean>(false);
	const { user } = useSelector((state: any) => state.userReducer);

	const colorScheme = useColorScheme();

	const dispatch = useDispatch();

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ["50%"], []);

	// callbacks
	const handleSheetChanges = useCallback(() => {}, []);

	const [editProfile, { loading }] = useMutation(EDIT_PROFILE, {
		variables: {
			editProfileInput: {
				name: userState?.name,
				contact: userState?.contact,
			},
		},
		onCompleted(data) {
			data.editProfile && dispatch(setUser(userState));
			bottomSheetModalRef.current?.close();
			navigation.navigate("ProfileScreen");
		},
		onError(err) {
			bottomSheetModalRef.current?.close();
			navigation.navigate("ProfileScreen");
		},
	});
	const [twoFactorAuth, { data: twoFactorData, loading: tfaLoading }] =
		useLazyQuery(TWOFACTOR_AUTH, {
			variables: {
				contact: userState?.contact.number,
				newAcc: false,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.twoFactorAuth.error
					? setMessage("Account with this contact does not exist.")
					: bottomSheetModalRef.current?.present();
			},
			onError(err) {
				Alert.alert("Oops!", `${err}. Try Again`);
				console.log(err);
			},
		});

	const [checkAuth, { loading: authLoading }] = useLazyQuery(CHECK_AUTH, {
		variables: {
			contact: userState?.contact.number,
			secureCode: code,
		},
		fetchPolicy: "no-cache",
		onCompleted(data) {
			if (data.checkAuth.error) {
				setMessage(
					"6 digit code does not match. Try Again or Resend code"
				);
				setCode("");
			} else {
				onConfirmChanges();
			}
		},
		onError(err) {
			Alert.alert(
				"Oops!",
				`${err}. Check 6 digit code or Get a new code.`
			);
		},
	});
	useEffect(() => {
		user && setUserState(user);
	}, [user]);

	useEffect(() => {
		setIsntSame(deepDiffer(userState, user));
	}, [userState]);

	const onConfirmChanges = () => {
		setVerified(true);
		editProfile();
	};

	if (user === null) {
		setTimeout(() => {
			navigation.navigate("Onboarding");
		}, 2000);
		return (
			<>
				<DynamicStatusBar />
				<View style={CommonStyles.loadingContainer}>
					<BoldText>No user found, redirecting to Login.</BoldText>
				</View>
			</>
		);
	}

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				key={4432301394}
				backdropComponent={CustomBackdrop}
				onChange={handleSheetChanges}
				style={{ borderRadius: 20 }}
				onDismiss={() => {
					navigation.navigate("ProfileScreen");
				}}
			>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
						padding: 10,
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
							autoFocusOnLoad
							codeInputFieldStyle={
								otpInputStyles.underlineStyleBase
							}
							codeInputHighlightStyle={
								otpInputStyles.underlineStyleHighLighted
							}
							onCodeFilled={(code) => {
								checkAuth({
									variables: {
										contact: userState?.contact.number,
										secureCode: code,
									},
								});
							}}
						/>
						<ResendOTP
							number={user?.contact.number}
							newAcc={false}
							date={twoFactorData?.twoFactorAuth.date}
							setCode={() => setCode("")}
						/>
					</View>
				</View>
				{message && (
					<View style={CommonStyles.errorContainer}>
						<Text style={CommonStyles.errorText}>{message}</Text>
					</View>
				)}
			</BottomSheetModal>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				{!loading ? (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("ProfileScreen")
								}
							>
								<AntDesign name="back" size={25} color="#222" />
							</TouchableOpacity>
							<View
								style={{
									...CommonStyles.screenTitle,
									alignSelf: "flex-start",
								}}
							>
								<BoldText style={CommonStyles.title}>
									Manage profile
								</BoldText>
							</View>
						</View>
						{userState ? (
							<KeyboardAvoidingView
								behavior="height"
								keyboardVerticalOffset={
									Platform.OS === "ios" ? 40 : 0
								}
							>
								<ScrollView
									style={{
										flex: 1,
										width: "100%",
									}}
									showsVerticalScrollIndicator={false}
								>
									<View style={CommonStyles.section}>
										<Input
											title="User's name"
											placeholder={`Eg. ${user.name}`}
											value={userState.name}
											onChange={(text: string) =>
												setUserState({
													...userState,
													name: text,
												})
											}
											error={userState.name.length < 1}
											errorMessage="User's name must be valid"
										/>
										<Text style={CommonStyles.sectionText}>
											You can change your name a few of
											times. Frequent changes will bar you
											from making the same
										</Text>
									</View>
									<View style={CommonStyles.section}>
										<Input
											title="Contact Number"
											placeholder="Eg. 99849XXXXX"
											value={userState.contact.number}
											onChange={(text: string) =>
												setUserState({
													...userState,
													contact: {
														...userState.contact,
														number: text,
													},
												})
											}
											error={false}
											errorMessage="User's number must be valid 10 digit mobile number."
										/>
										<Text style={CommonStyles.sectionText}>
											Contact verification will be done if
											and after confirming changes.
										</Text>
									</View>

									{!isntSame && (
										<View style={CommonStyles.section}>
											<BoldText
												style={CommonStyles.sectionText}
											>
												Delete Account
											</BoldText>
											<DeleteBtn />
											<Text
												style={CommonStyles.sectionText}
											>
												<Text
													style={{ color: "#dd0000" }}
												>
													Your account details will be
													deleted. This action is
													irreversible
												</Text>
											</Text>
										</View>
									)}
								</ScrollView>
							</KeyboardAvoidingView>
						) : (
							<LoadingContainer />
						)}
					</View>
				) : (
					<LoadingContainer />
				)}
				{isntSame && (
					<View style={styles.actionBtnContainer}>
						<ActionBtn
							disable={!isntSame}
							disabled={!isntSame}
							onPress={() => {
								Keyboard.dismiss();
								twoFactorAuth({
									variables: {
										contact: userState?.contact.number,
										newAcc: false,
									},
								});
							}}
						>
							{tfaLoading || authLoading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<ActionBtnText>
									{verified ? "Confirm Changes" : "Verify"}
								</ActionBtnText>
							)}
						</ActionBtn>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	actionBtnContainer: {
		width: "90%",
		alignSelf: "center",
		marginVertical: 10,
		position: "absolute",
		bottom: 0,
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
