import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { StyleSheet, StatusBar, TouchableOpacity } from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import {
	BoldText,
	View,
	Text,
	TextInput,
} from "../../components/Common/Themed";
import SelectContact from "../../components/Common/Contacts";
import {
	CommonStyles,
	ActionBtn,
	ActionBtnText,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../../components/Common/Elements";
import Input from "../../components/Common/Input";

import { validateContact } from "../../util/validators";

interface EditVendorScreenProps {
	setEditVendor: any;
	editVendor: boolean;
	vendorDetails: any;
	setVendorDetails: any;
}

export function EditVendorScreen(props: EditVendorScreenProps) {
	const [valid, setValid] = useState<boolean>(false);

	const bottomSheetContactModalRef = useRef<BottomSheetModal>(null);
	const largeSnapPoints = useMemo(() => ["50%", "75%"], []);
	const handleSheetChanges = useCallback(() => {}, []);

	useEffect(() => {
		const { valid } = validateContact(
			props.vendorDetails.contact.number || ""
		);
		setValid(valid);
	}, [props.vendorDetails.contact]);

	return (
		<>
			<SelectContact
				contactValue={props.vendorDetails}
				onSelectValue={props.setVendorDetails}
				bottomSheetModalRef={bottomSheetContactModalRef}
				snapPoints={largeSnapPoints}
				handleSheetChanges={handleSheetChanges}
			/>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() =>
								props.setEditVendor(!props.editVendor)
							}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
						<BoldText style={CommonStyles.title}>
							Edit Vendor
						</BoldText>
					</View>

					{props.vendorDetails.contact.number && (
						<View
							style={{
								padding: 10,
								borderRadius: 10,
								marginBottom: 10,
								width: "100%",
								alignItems: "flex-start",
								backgroundColor: "#11111122",
							}}
						>
							<BoldText>Current Vendor</BoldText>
							<Text
								style={{
									...styles.brand,
									color: "#1ea472",
								}}
							>
								{props.vendorDetails.name}
							</Text>
							<Text style={{ fontSize: 20, color: "#1ea472" }}>
								{props.vendorDetails.contact.number}
							</Text>
						</View>
					)}
					<Input
						title="Vendor Name"
						placeholder="Eg. Raj Kunal"
						onChange={(text: string) =>
							props.setVendorDetails({
								...props.vendorDetails,
								name: text,
							})
						}
						value={props.vendorDetails.name || ""}
						error={false}
						errorMessage=""
					/>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<TouchableOpacity
							style={{
								...styles.vendorTextInput,
								borderWidth: 0,
							}}
						>
							<Text style={{ fontSize: 16 }}>
								{props.vendorDetails.ISD
									? props.vendorDetails.ISD
									: "+91"}
							</Text>
						</TouchableOpacity>
						<TextInput
							style={{
								...styles.vendorTextInput,
								flex: 1,
								marginLeft: 10,
							}}
							value={
								props.vendorDetails.contact.number
									? props.vendorDetails.contact.number
									: ""
							}
							placeholder="Vendor Number"
							onChangeText={(text) =>
								props.setVendorDetails({
									...props.vendorDetails,
									contact: {
										...props.vendorDetails.contact,
										number: text,
									},
								})
							}
							keyboardType="phone-pad"
							key={332309}
							maxLength={10}
						/>
					</View>
				</View>
				{/* btns */}
				<View style={styles.actions}>
					<TouchableOpacity
						style={{
							...styles.actionbtn,
							flex: 1,
							height: 60,
							borderWidth: 1,
							borderColor: "#eee",
							backgroundColor: "#eee",
						}}
						onPress={() =>
							bottomSheetContactModalRef.current?.present()
						}
					>
						<Text
							style={{
								color: "#111",
								fontSize: 16,
							}}
						>
							Choose Contact
						</Text>
					</TouchableOpacity>

					{props.vendorDetails.contact.number !== null && (
						<>
							<View style={{ width: 10 }} />
							<TouchableOpacity
								delayPressIn={0}
								style={{
									...styles.actionbtn,
									flex: 1,
									height: 60,
									borderWidth: 1,
									borderColor: !valid ? "#1ea472" : "#111",
									backgroundColor: !valid
										? "#1ea472"
										: "#111",
								}}
								disabled={valid}
								onPress={() =>
									props.setEditVendor(!props.editVendor)
								}
							>
								<BoldText
									style={{ color: "#fff", fontSize: 16 }}
								>
									Confirm Vendor
								</BoldText>
							</TouchableOpacity>
						</>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	brand: {
		fontSize: 30,
	},
	vendorActionBtnContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: "2%",
	},
	vendorActionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		padding: 10,
	},
	vendorActionBtnText: {
		marginLeft: 10,
		fontSize: 16,
	},
	vendorTextInput: {
		padding: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "#999",
		borderRadius: 5,
		fontSize: 16,
		marginVertical: 5,
	},
	actions: {
		width: "95%",
		alignSelf: "center",
		marginBottom: "5%",
		flexDirection: "row",
		alignItems: "center",
	},
	actionbtn: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		padding: 15,
	},
	actiontext: {
		textTransform: "uppercase",
		fontSize: 16,
		color: "#111",
	},
});
