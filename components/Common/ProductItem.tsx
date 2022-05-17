import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { ImageLoader } from "react-native-image-fallback";

import { BoldText, Text } from "./Themed";

import { ICON_URI, IMG_URI } from "../../constants/Urls";

interface ProductItemProps {
	data: any;
	onPress: any;
	fullScreen: boolean;
}

function ProductName(props: { brand: string; name: string }) {
	var productName;
	if (
		props.name
			.replace(/[^!.'?\s]/g, "")
			.startsWith(props.brand.replace(/[^!.'?\s]/g, ""))
	) {
		productName = props.name.replace(props.brand + " ", "");
	} else {
		productName = props.name;
	}
	return (
		<Text style={{ fontSize: 14 }} numberOfLines={2}>
			{productName}
		</Text>
	);
}

export default function ProductItem(props: ProductItemProps) {
	const [skuItem, setSkuItem] = useState<object | any>(props.data?.skus[0]);

	function handlePress() {
		props.onPress(props.data);
	}

	return (
		<View style={{ marginBottom: 10, width: "100%" }}>
			<View
				style={{
					width: "100%",
					borderRadius: 5,
					paddingTop: 0,
					padding: 5,
					backgroundColor: "#fff",
				}}
			>
				<TouchableOpacity
					style={{
						width: "100%",
						flexDirection: "row",
						alignItems: "center",
						paddingTop: 5,
					}}
					activeOpacity={0.7}
					onPress={() => {
						handlePress();
					}}
				>
					<ImageLoader
						source={`${IMG_URI}${skuItem?.imageUrl}.jpg`}
						fallback={[`${ICON_URI}imagedefault.png`]}
						style={{
							height: props.fullScreen ? 80 : 40,
							width: props.fullScreen ? 80 : 40,
							borderRadius: 5,
							marginRight: 10,
						}}
					/>
					<View
						style={{
							flexDirection: "column",
							alignItems: "flex-start",
							flex: 1,
						}}
					>
						<BoldText
							style={{
								fontSize: props.fullScreen ? 16 : 14,
								color: "#666",
								marginBottom: 5,
							}}
						>
							{props.data.name}
						</BoldText>
						<BoldText style={{ fontSize: 16, lineHeight: 18 }}>
							<Text style={{ lineHeight: 18, color: "#888" }}>
								{props.data.skus.length > 1 && "Starting at "}
							</Text>
							₹ {skuItem?.price.mrp}/-
						</BoldText>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
