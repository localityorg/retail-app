import React from "react";
import { LineChart } from "react-native-chart-kit";
import { StyleSheet, Dimensions } from "react-native";

import { View } from "../Common/Themed";

import useColorScheme from "../../hooks/useColorScheme";
import Colors from "../../constants/Colors";

interface GraphProps {
	labels: any;
	data: any;
	height: number;
	type: number;
}

export default function Graph(props: GraphProps) {
	const colorScheme = useColorScheme();
	return (
		<View style={styles.graphContainer}>
			<LineChart
				data={{
					labels: props.labels,
					datasets: [
						{
							data: props.data,
						},
					],
				}}
				withInnerLines={false}
				width={Dimensions.get("window").width} // from react-native
				height={props.height}
				yAxisLabel={props.type === 1 ? "₹" : ""}
				yAxisInterval={1} // optional, defaults to 1
				chartConfig={{
					backgroundColor: "#e2e2e2",
					backgroundGradientFrom: Colors[colorScheme].background,
					backgroundGradientTo: Colors[colorScheme].background,
					decimalPlaces: props.type === 1 ? 2 : 0, // optional, defaults to 2dp
					color: () => Colors[colorScheme].tint,
					labelColor: () => Colors[colorScheme].text,
					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "6",
						strokeWidth: "1",
						stroke: Colors[colorScheme].tint,
					},
				}}
				bezier
				style={{
					borderRadius: 16,
					backgroundColor: Colors[colorScheme].background,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	graphContainer: {
		width: "100%",
		marginVertical: 10,
	},
});
