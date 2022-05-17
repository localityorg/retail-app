import React from "react";
import { StatusBar } from "react-native";
import useColorScheme from "../../hooks/useColorScheme";

export default function DynamicStatusBar() {
	const colorScheme = useColorScheme();
	return (
		<StatusBar
			barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
			// backgroundColor={Colors[colorScheme].background}
			backgroundColor="transparent"
		/>
	);
}
