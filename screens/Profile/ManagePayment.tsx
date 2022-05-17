import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import deepDiffer from "react-native/Libraries/Utilities/differ/deepDiffer";

import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
} from "../../components/Common/Elements";
import { BoldText, Text } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";

import { setUser } from "../../redux/actions";

import { SET_ADDRESS } from "../../graphql/userdefs";

import { RootTabScreenProps } from "../../types";
import Input from "../../components/Common/Input";

export default function ManagePayment({
	navigation,
}: RootTabScreenProps<"ManagePayment">) {
	const [userState, setUserState] = useState<any>(null);

	const dispatch = useDispatch();

	const { user } = useSelector((state: any) => state.userReducer);

	const [editUpi, { loading }] = useMutation(SET_ADDRESS, {
		variables: { address: userState?.upiAddress },
		onCompleted(data) {
			if (data.editUpi) {
				dispatch(setUser(userState));
				navigation.navigate("ProfileScreen");
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	useEffect(() => {
		user && setUserState(user);
	}, [user]);

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("ProfileScreen")}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
					</View>

					<View style={CommonStyles.screenTitle}>
						<BoldText style={CommonStyles.title}>
							Manage Payment methods
						</BoldText>
					</View>

					{userState && (
						<View style={CommonStyles.section}>
							<Input
								title="UPI address"
								placeholder="Your UPI"
								value={
									userState?.upiAddress
										? userState?.upiAddress
										: ""
								}
								onChange={(text: string) =>
									setUserState({
										...userState,
										upiAddress: text,
									})
								}
								error={false}
								errorMessage=""
							/>
							<Text style={CommonStyles.sectionText}>
								You'll recieve payments to this address.
							</Text>
						</View>
					)}
				</View>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
						marginBottom: "5%",
					}}
				>
					<ActionBtn
						onPress={() => editUpi()}
						disable={!deepDiffer(userState, user)}
						disabled={!deepDiffer(userState, user)}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<ActionBtnText>Confirm UPI Address</ActionBtnText>
						)}
					</ActionBtn>
				</View>
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
});
