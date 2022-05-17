import React from "react";
import { StyleSheet, StatusBar } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { View } from "../../components/Common/Themed";
import BarcodeScanner from "../../components/Common/BarcodeScanner";

import { CommonStyles } from "../../components/Common/Elements";

interface ScanBarcodeProps {
	scanned: boolean;
	handleBarCodeScanned: any;
}

export function ScanBarcode(props: ScanBarcodeProps) {
	return (
		<View style={CommonStyles.container}>
			<View style={styles.barcodeMainContainer}>
				<View style={styles.barcodeScannerContainer}>
					<View style={styles.barcodebox}>
						<BarcodeScanner
							scanned={props.scanned}
							handleBarCodeScanned={props.handleBarCodeScanned}
							height={1920}
							width={820}
							revertPath={"Store"}
						/>
					</View>
					<Ionicons
						name="ios-scan-outline"
						color="#ffffff55"
						size={350}
						style={{
							position: "absolute",
							alignSelf: "center",
						}}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	barcodeMainContainer: {
		flex: 1,
		width: "100%",
	},
	barcodeScannerContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	barcodebox: {
		width: "100%",
		height: "100%",
		backgroundColor: "#111",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
});
