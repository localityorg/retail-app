import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { useLazyQuery } from "@apollo/client";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import OTPInputView from "@twotalltotems/react-native-otp-input";

import ResendOTP from "../Common/ResendOTP";
import { BoldText, Text, View } from "../Common/Themed";
import { CommonStyles, LoadingContainer } from "../Common/Elements";
import { CustomBackdrop } from "../Common/ModalStyle";

import { CHECK_AUTH } from "../../graphql/authdefs";
import { setAskPin } from "../../redux/actions";

interface TFAProps {
	onCompleted: any;
	onDismiss: any;
	bottomSheetModalRef: any;
	snapPoints: any;
	handleSheetChanges: any;
	message: string;
	date: string;
}

export default function TFA(props: TFAProps) {
	const [userState, setUserState] = useState<any>(null);
	const [message, setMessage] = useState<string | any>(null);
	const [code, setCode] = useState<string>("");
	const dispatch = useDispatch();
	const { user } = useSelector((state: any) => state.userReducer);

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
			} else {
				dispatch(setAskPin(false));
				props.onCompleted();
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
		setMessage(props.message);
	}, [props.message]);

	return (
		<BottomSheetModal
			ref={props.bottomSheetModalRef}
			index={0}
			snapPoints={props.snapPoints}
			onChange={props.handleSheetChanges}
			style={{ borderRadius: 20 }}
			backdropComponent={CustomBackdrop}
			onDismiss={props.onDismiss}
		>
			{authLoading ? (
				<LoadingContainer />
			) : (
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
								height: 60,
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
							date={props.date}
							newAcc={false}
							number={user?.contact.number}
							setCode={() => setCode("")}
						/>
					</View>
				</View>
			)}
			{message && (
				<View style={CommonStyles.errorContainer}>
					<Text style={CommonStyles.errorText}>{message}</Text>
				</View>
			)}
		</BottomSheetModal>
	);
}

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
