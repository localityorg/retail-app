import React from "react";
import { StyleSheet, View, Image } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { BoldText, BoldTitle } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";
import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../../components/Common/Elements";

const Onboarding = () => {
	const navigation = useNavigation();
	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={styles.mainContainer}>
					<Image
						source={require("../../assets/images/logo-primary.png")}
						style={{
							width: "100%",
							height: "100%",
							maxHeight: 400,
							resizeMode: "contain",
						}}
					/>
					<BoldTitle style={{ fontSize: 30 }}>
						App{" "}
						<BoldTitle style={styles.logoName}>for you</BoldTitle>{" "}
						to manage{" "}
						<BoldTitle style={styles.logoName}>your shop</BoldTitle>{" "}
						in{" "}
						<BoldTitle style={styles.logoName}>
							your locality.
						</BoldTitle>
					</BoldTitle>
				</View>
				<View style={styles.actionBtnContainer}>
					<ActionBtn
						onPress={() => navigation.navigate("Login")}
						activeOpacity={0.8}
						disable={false}
					>
						<ActionBtnText>Log In</ActionBtnText>
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
		</>
	);
};

export default Onboarding;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	header: {
		width: "100%",
		height: 70,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	logoName: {
		color: "#1ea472",
		fontSize: 30,
	},
	actionBtnContainer: {
		flexDirection: "column",
		alignItems: "center",
		width: "90%",
		borderRadius: 10,
		overflow: "hidden",
		marginBottom: "3%",
	},
});
