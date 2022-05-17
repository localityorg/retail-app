import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { CommonStyles } from "../../components/Common/Elements";
import { View, BoldText, Text } from "../../components/Common/Themed";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

import { RootStackScreenProps } from "../../types";

export default function NotFoundScreen({
	navigation,
}: RootStackScreenProps<"NotFound">) {
	const colorScheme = useColorScheme();

	function returnToRoot() {
		const unsubscribe = setTimeout(() => {
			navigation.navigate("Splash");
		}, 3000);
		return unsubscribe;
	}

	useEffect(() => {
		returnToRoot();
	}, []);

	return (
		<View style={CommonStyles.container}>
			<View style={CommonStyles.mainContainer}>
				<Text style={CommonStyles.title}>
					This screen doesn't exist.
				</Text>
				<TouchableOpacity
					onPress={() => navigation.replace("Splash")}
					style={styles.link}
				>
					<BoldText
						style={{
							fontSize: 14,
							color: Colors[colorScheme].tint,
						}}
					>
						Redirecting to Home...
					</BoldText>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
	linkText: {
		fontSize: 14,
	},
});
