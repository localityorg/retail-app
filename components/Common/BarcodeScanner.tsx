import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";

import { View, Text, BoldText } from "./Themed";
import { CommonStyles } from "./Elements";

interface CameraProps {
	revertPath: string;
	height: number;
	width: number;
	scanned: any;
	handleBarCodeScanned: any;
}

const barCodeTypes = [
	BarCodeScanner.Constants.BarCodeType.aztec,
	BarCodeScanner.Constants.BarCodeType.codabar,
	BarCodeScanner.Constants.BarCodeType.code39,
	BarCodeScanner.Constants.BarCodeType.code93,
	BarCodeScanner.Constants.BarCodeType.code128,
	BarCodeScanner.Constants.BarCodeType.code39mod43,
	BarCodeScanner.Constants.BarCodeType.datamatrix,
	BarCodeScanner.Constants.BarCodeType.ean13,
	BarCodeScanner.Constants.BarCodeType.ean8,
	BarCodeScanner.Constants.BarCodeType.interleaved2of5,
	BarCodeScanner.Constants.BarCodeType.itf14,
	BarCodeScanner.Constants.BarCodeType.maxicode,
	BarCodeScanner.Constants.BarCodeType.pdf417,
	BarCodeScanner.Constants.BarCodeType.rss14,
	BarCodeScanner.Constants.BarCodeType.rssexpanded,
	BarCodeScanner.Constants.BarCodeType.upc_a,
	BarCodeScanner.Constants.BarCodeType.upc_e,
	BarCodeScanner.Constants.BarCodeType.upc_ean,
];

export default function BarcodeScanner(props: CameraProps) {
	const [hasPermission, setHasPermission] = useState<string | any>(null);
	const navigation: any = useNavigation();

	const askForCameraPermission = () => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status ? "granted" : "denied");
		})();
	};

	useEffect(() => {
		askForCameraPermission();
	}, []);

	if (hasPermission === null) {
		return (
			<View style={CommonStyles.container}>
				<View style={CommonStyles.loadingContainer}>
					<BoldText style={CommonStyles.title}>
						Requesting camera permissions.
					</BoldText>
				</View>
			</View>
		);
	}

	if (hasPermission !== "granted") {
		return (
			<>
				<View
					style={{
						...CommonStyles.container,
						backgroundColor: "#171717",
						marginTop: 0,
					}}
				>
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate(props.revertPath)
								}
							>
								<AntDesign name="back" size={25} color="#fff" />
							</TouchableOpacity>
						</View>
						<View style={CommonStyles.loadingContainer}>
							<BoldText
								style={{ ...CommonStyles.title, color: "#fff" }}
							>
								Camera permission denied!
							</BoldText>
							<Text style={{ ...styles.subtitle, color: "#fff" }}>
								Enable Camera service to continue scanning
								products.
							</Text>
							<TouchableOpacity
								style={styles.refreshLocationBtn}
								onPress={() => askForCameraPermission()}
							>
								<AntDesign
									name="reload1"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</>
		);
	}

	return (
		<Camera
			onBarCodeScanned={
				props.scanned ? undefined : props.handleBarCodeScanned
			}
			type="back"
			focusable
			barCodeScannerSettings={{
				barCodeTypes: barCodeTypes,
			}}
			style={{
				height: 1000,
				width: 620,
			}}
		/>
	);
}

const styles = StyleSheet.create({
	refreshLocationBtn: {
		marginVertical: 10,
		borderRadius: 100,
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		width: 50,
		backgroundColor: "#eeeeee55",
	},
	subtitle: {
		fontSize: 25,
	},
});
