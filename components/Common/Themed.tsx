/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from "react";
import {
	Text as DefaultText,
	View as DefaultView,
	TextInput as DefaultTextInput,
} from "react-native";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme();
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function BoldTitle(props: TextProps) {
	let [fontsLoaded] = useFonts({
		"Raleway-Bold": require("../../assets/fonts/Raleway-Bold.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultText
				style={[{ color, fontFamily: "Raleway-Bold" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function Title(props: TextProps) {
	let [fontsLoaded] = useFonts({
		"Raleway-Regular": require("../../assets/fonts/Raleway-Regular.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultText
				style={[{ color, fontFamily: "Raleway-Regular" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function BoldText(props: TextProps) {
	let [fontsLoaded] = useFonts({
		"OpenSans-SemiBold": require("../../assets/fonts/OpenSans-SemiBold.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultText
				style={[{ color, fontFamily: "OpenSans-SemiBold" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function Text(props: TextProps) {
	let [fontsLoaded] = useFonts({
		"OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultText
				style={[{ color, fontFamily: "OpenSans-Regular" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function TextInput(props: TextInputProps) {
	let [fontsLoaded] = useFonts({
		"OpenSans-Regular": require("../../assets/fonts/OpenSans-Regular.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultTextInput
				style={[{ color, fontFamily: "OpenSans-Regular" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function BoldTextInput(props: TextInputProps) {
	let [fontsLoaded] = useFonts({
		"OpenSans-SemiBold": require("../../assets/fonts/OpenSans-SemiBold.ttf"),
	});
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<DefaultTextInput
				style={[{ color, fontFamily: "OpenSans-SemiBold" }, style]}
				{...otherProps}
			/>
		);
	}
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: lightColor },
		"background"
	);

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
