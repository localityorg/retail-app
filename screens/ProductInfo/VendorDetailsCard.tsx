import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { BoldText, View, Text } from "../../components/Common/Themed";

interface VendorDetailsCardProps {
	editVendor: boolean;
	vendorDetails: any;
	setEditVendor: any;
	setVendorDetails: any;
}

export function VendorDetailsCard(props: VendorDetailsCardProps) {
	return (
		<View style={styles.vendorCard}>
			<View
				style={{
					backgroundColor: "transparent",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<BoldText numberOfLines={1} style={styles.vendorNameMeta}>
					{props.editVendor && "Edit "}Vendor:{"  "}
					{!props.editVendor && (
						<Text style={styles.vendorName} numberOfLines={1}>
							{props.vendorDetails.name}
						</Text>
					)}
				</BoldText>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "transparent",
					marginTop: 10,
				}}
			>
				<TouchableOpacity
					style={{
						flex: 1,
						height: 50,
						alignItems: "flex-start",
						justifyContent: "center",
					}}
					onPress={() =>
						Linking.openURL(
							`tel:${props.vendorDetails.contact.number}`
						)
					}
				>
					<Text
						style={{
							...styles.vendorActionBtnText,
							color: "#1ea472",
						}}
					>
						Call Vendor
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						flex: 1,
						height: 50,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "transparent",
						marginHorizontal: 10,
					}}
					onPress={() => props.setEditVendor(!props.editVendor)}
				>
					<Text
						style={{
							...styles.vendorActionBtnText,
							color: "#111",
						}}
					>
						Edit
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						flex: 1,
						height: 50,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#dd000022",
					}}
					onPress={() =>
						props.setVendorDetails({
							name: null,
							contact: {
								ISD: null,
								number: null,
							},
						})
					}
				>
					<Text
						style={{
							...styles.vendorActionBtnText,
							color: "red",
						}}
					>
						Delete
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	vendorCard: {
		width: "100%",
		flexDirection: "column",
	},
	vendorNameMeta: { fontSize: 16, color: "#111" },
	vendorName: { fontSize: 18, fontWeight: "normal", color: "#111" },
	vendorActionBtnContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: "2%",
	},
	vendorActionBtn: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		padding: 10,
	},
	vendorActionBtnText: {
		fontSize: 16,
	},
});
