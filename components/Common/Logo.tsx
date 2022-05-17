import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { BoldTitle } from "./Themed";

interface LogoProps {
	onPress: any;
}

export default function Logo(props: LogoProps) {
	return (
		<TouchableOpacity
			style={styles.logoContainer}
			activeOpacity={0.5}
			onPress={props.onPress()}
		>
			<BoldTitle>locality.</BoldTitle>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	logoContainer: {
		paddingLeft: 3,
	},
	logo: {
		fontSize: 24,
		color: "#1ea472",
	},
});
