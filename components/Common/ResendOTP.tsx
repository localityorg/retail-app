import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Alert } from "react-native";

import { useLazyQuery } from "@apollo/client";
import moment from "moment";

import { View, BoldText, Text } from "./Themed";
import { TWOFACTOR_AUTH } from "../../graphql/authdefs";

interface ResendOTPProps {
	date: string;
	newAcc: boolean;
	setCode: any;
	number: string;
}

export default function ResendOTP(props: ResendOTPProps) {
	// timer
	const [confirmTimer, setConfirmTimer] = useState<number>(1);
	const [date, setDate] = useState(props.date);

	// track of time, delivery
	const [timer, setTimer] = useState({
		over: false,
		min: 0,
		sec: 0,
	});

	useEffect(() => {
		confirmTimer > 0 &&
			setTimeout(() => setConfirmTimer(confirmTimer + 1), 1000);

		let currentTime = new Date();
		let expireTime = new Date(date);

		setTimer({
			over: currentTime > expireTime ? true : false,
			min: Math.abs(moment(expireTime).diff(currentTime, "minutes") % 60),
			sec: Math.abs(moment(expireTime).diff(currentTime, "seconds") % 60),
		});
	}, [confirmTimer]);

	const [twoFactorAuth] = useLazyQuery(TWOFACTOR_AUTH, {
		variables: {
			contact: props.number,
			newAcc: props.newAcc,
		},
		fetchPolicy: "no-cache",
		onCompleted(data) {
			if (!data.twoFactorAuth.error) {
				setDate(data.twoFactorAuth.date);
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	return (
		<View style={timeStyles.container}>
			{timer.over ? (
				<TouchableOpacity
					onPress={() =>
						twoFactorAuth({
							variables: {
								contact: props.number,
								newAcc: props.newAcc,
							},
						})
					}
				>
					<BoldText style={{ textDecorationLine: "underline" }}>
						Resend Code
					</BoldText>
				</TouchableOpacity>
			) : (
				<Text style={timeStyles.text}>
					Request New Code in{" "}
					<BoldText>
						{timer.min} <Text>m</Text> {timer.sec} <Text>s</Text>
					</BoldText>
				</Text>
			)}
		</View>
	);
}

const timeStyles = StyleSheet.create({
	container: {
		marginVertical: 10,
		width: "100%",
		backgroundColor: "transparent",
		alignSelf: "flex-start",
	},
	text: {
		fontSize: 14,
	},
});
