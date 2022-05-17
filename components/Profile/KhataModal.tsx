import React, { useState } from "react";

import {
	View,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
} from "react-native";

import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../Common/Elements";
import Input from "../Common/Input";
import { BoldText, Text } from "../Common/Themed";
import { CustomBackdrop } from "../Common/ModalStyle";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import DisplayImg from "../DisplayImg";

interface KhataModalProps {
	bottomSheetKhataModalRef: any;
	bottomSheetContactModalRef: any;
	largeSnapPoints: any;
	handleSheetChanges: any;
	newRunningAccount: any;
	setNewRunningAccount: any;
	addNewRunningAccount: any;
	addingAccount: any;
}

export default function KhataModal(props: KhataModalProps) {
	const colorScheme = useColorScheme();
	const [newAccount, setNewAccount] = useState<boolean>(false);

	const { accounts } = useSelector((state: any) => state.storeReducer);

	return (
		<BottomSheetModal
			ref={props.bottomSheetKhataModalRef}
			index={1}
			key={94999934}
			snapPoints={props.largeSnapPoints}
			onChange={props.handleSheetChanges}
			backdropComponent={CustomBackdrop}
			style={{
				borderRadius: 20,
			}}
		>
			<View style={{ ...CommonStyles.container, marginTop: 0 }}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<BoldText style={CommonStyles.title}>
							{!newAccount ? "New Account" : "Your Accounts"}
						</BoldText>
						<TouchableOpacity
							style={{
								padding: 5,
								paddingHorizontal: 10,
								backgroundColor: "#333",
							}}
							onPress={() => setNewAccount(!newAccount)}
						>
							<Text style={{ color: "#fff", fontSize: 14 }}>
								{newAccount ? "Add new" : "Accounts"}
							</Text>
						</TouchableOpacity>
					</View>
					{newAccount ? (
						<View style={{ flex: 1, width: "100%" }}>
							<View style={{ flex: 1 }}>
								<BottomSheetFlatList
									data={accounts}
									initialNumToRender={10}
									keyExtractor={(e: any) =>
										e.data.id.toString()
									}
									renderItem={({ item }: any) => (
										<TouchableOpacity
											style={styles.khataRow}
											onPress={() => {
												props.setNewRunningAccount({
													...props.newRunningAccount,
													name: item.data.name,
													contact: {
														ISD: item.data.contact
															.ISD,
														number: item.data
															.contact.number,
													},
												});
											}}
										>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<DisplayImg
													name={item.data.name}
													size={30}
													off={item.data.closed}
												/>

												<BoldText
													style={{
														paddingLeft: 10,
														fontSize: 16,
													}}
												>
													{item.data.name}
												</BoldText>
											</View>
											<View
												style={{
													flexDirection: "column",
													alignItems: "flex-start",
												}}
											>
												<BoldText>
													₹ {item.data.totalAmount}/-
												</BoldText>
												<BoldText
													style={{
														color: item.data.closed
															? "#111"
															: "#1ea472",
													}}
												>
													{item.data.closed
														? "closed"
														: "open"}
												</BoldText>
											</View>
										</TouchableOpacity>
									)}
								/>
							</View>
							<View style={{ width: "100%" }}>
								<SecondaryActionBtn
									disable={false}
									disabled={
										props.newRunningAccount.name.length ===
											0 &&
										props.newRunningAccount.contact.number
											.length !== 10
									}
									onPress={props.addNewRunningAccount}
									style={{
										marginBottom: "5%",
										width:
											Dimensions.get("window").width - 50,
									}}
								>
									{props.addingAccount ? (
										<ActivityIndicator color="#fff" />
									) : (
										<SecondaryActionBtnText
											style={{
												color: "#eee",
												fontSize: 14,
											}}
										>
											{props.newRunningAccount.name
												.length !== 0
												? `Confirm adding to ${props.newRunningAccount.name}'s account`
												: "Choose an account"}
										</SecondaryActionBtnText>
									)}
								</SecondaryActionBtn>
							</View>
						</View>
					) : (
						<View
							style={{
								...CommonStyles.section,
								marginTop: 10,
								flex: 1,
							}}
						>
							<Input
								title="Account Holder Name"
								placeholder="eg. Raj Kiran"
								value={props.newRunningAccount.name}
								onChange={(text: string) =>
									props.setNewRunningAccount({
										...props.newRunningAccount,
										name: text,
									})
								}
								error={false}
								errorMessage=""
							/>
							<Input
								title="Account Holder Number"
								placeholder="eg. 9987XXXXXX"
								value={props.newRunningAccount.contact.number}
								maxLength={10}
								onChange={(text: number) =>
									props.setNewRunningAccount({
										...props.newRunningAccount,
										contact: {
											...props.newRunningAccount.contact,
											number: text,
										},
									})
								}
								error={false}
								errorMessage=""
							/>
							<View
								style={{
									width: "100%",
									position: "absolute",
									bottom: 0,
									alignSelf: "center",
								}}
							>
								{props.newRunningAccount.contact.number.length <
								10 ? (
									<SecondaryActionBtn
										disable={true}
										onPress={() =>
											props.bottomSheetContactModalRef.current?.present()
										}
										style={{
											backgroundColor: "transparent",
										}}
									>
										<SecondaryActionBtnText
											style={{ fontSize: 16 }}
										>
											Add from Contacts
										</SecondaryActionBtnText>
									</SecondaryActionBtn>
								) : (
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<ActionBtn
											disable={
												props.newRunningAccount.name
													.length === 0 &&
												props.newRunningAccount.number
													.length !== 10
											}
											disabled={
												props.newRunningAccount.name
													.length === 0 &&
												props.newRunningAccount.number
													.length !== 10
											}
											onPress={() =>
												props.addNewRunningAccount()
											}
											style={{
												flex: 1,
											}}
										>
											{props.addingAccount ? (
												<ActivityIndicator color="#fff" />
											) : (
												<ActionBtnText
													style={{ color: "#eee" }}
												>
													Add Account
												</ActionBtnText>
											)}
										</ActionBtn>

										<TouchableOpacity
											style={styles.cardactionBtn}
											disabled={props.addingAccount}
											onPress={() => {
												props.setNewRunningAccount({
													...props.newRunningAccount,
													name: "",
													contact: {
														...props
															.newRunningAccount
															.contact,
														number: "",
													},
												});
											}}
										>
											<Ionicons
												name="trash-outline"
												size={25}
												color="#111"
											/>
										</TouchableOpacity>
									</View>
								)}
							</View>
						</View>
					)}
				</View>
			</View>
		</BottomSheetModal>
	);
}

const styles = StyleSheet.create({
	rowContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	cardactionBtn: {
		padding: 3,
		marginLeft: "5%",
		paddingHorizontal: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	khataRow: {
		width: "100%",
		padding: 10,
		paddingHorizontal: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
