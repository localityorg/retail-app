import React, { useMemo } from "react";

import {
	BottomSheetBackgroundProps,
	BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, {
	useAnimatedStyle,
	interpolateColor,
	Extrapolate,
	interpolate,
} from "react-native-reanimated";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export const CustomBackdrop = ({
	animatedIndex,
	style,
}: BottomSheetBackdropProps) => {
	// animated variables
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: interpolate(
			animatedIndex.value,
			[0.5, 1],
			[0.5, 1],
			Extrapolate.CLAMP
		),
	}));

	// styles
	const containerStyle = useMemo(
		() => [
			style,
			{
				backgroundColor: "#111111",
			},
			containerAnimatedStyle,
		],
		[style, containerAnimatedStyle]
	);

	return (
		<Animated.View
			style={containerStyle}
			pointerEvents={animatedIndex.value ? "none" : "auto"}
		/>
	);
};

export const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
	style,
	animatedIndex,
}) => {
	const colorScheme = useColorScheme();
	//#region styles
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		// @ts-ignore
		backgroundColor: interpolateColor(
			animatedIndex.value,
			[1, 1],
			["#fff", Colors[colorScheme].background]
		),
		borderRadius: 20,
		// marginHorizontal: "5%",
	}));
	const containerStyle = useMemo(
		() => [style, containerAnimatedStyle],
		[style, containerAnimatedStyle]
	);
	//#endregion

	// render
	return <Animated.View pointerEvents="none" style={containerStyle} />;
};
