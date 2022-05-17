import React, { useState } from "react";
import {
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	Alert,
	ActivityIndicator,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { NetworkStatus, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import { BoldText, Text, View } from "../components/Common/Themed";
import { CommonStyles } from "../components/Common/Elements";
import Graph from "../components/Stats/Graph";
import DynamicStatusBar from "../components/Common/StatusBar";

import Colors from "../constants/Colors";

import useColorScheme from "../hooks/useColorScheme";
import { FETCH_ALLSTAT, GET_PAYMENT_OPTIONS } from "../graphql/statdefs";

import { RootTabScreenProps } from "../types";

const data = [
	["January", "February", "March"],
	[Math.random() * 100, Math.random() * 100, Math.random() * 100],
	[Math.random() * 1000, Math.random() * 1000, Math.random() * 1000],
];

// return an array index1 = days, index2 = revenue, index3 = orders

export default function Stats({ navigation }: RootTabScreenProps<"Stats">) {
	const [storeStat, setStoreStat] = useState<any>(null);
	const {
		loading: statLoading,
		refetch: refetchStat,
		networkStatus: statNetworkStatus,
	} = useQuery(FETCH_ALLSTAT, {
		onError(err) {
			console.log(err);
		},
		fetchPolicy: "no-cache",
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			if (!data.getAllStats.error) {
				setStoreStat(data.getAllStats.data);
			} else {
				Alert.alert(
					"Cant fetch statistics!",
					data.getAllStats.errorMessage
				);
				setTimeout(() => navigation.navigate("Store"), 3000);
			}
		},
	});

	const { data: options, loading: gettingPaymentOptions } = useQuery(
		GET_PAYMENT_OPTIONS,
		{
			onError(err) {
				console.log(err);
			},
		}
	);
	const { store } = useSelector((state: any) => state.storeReducer);
	const colorScheme = useColorScheme();

	if (statLoading) {
		return (
			<View style={CommonStyles.loadingContainer}>
				<BoldText style={{ fontSize: 16 }}>
					Fetching stats of{" "}
					<BoldText style={{ color: "#1ea472" }}>
						your store.
					</BoldText>
				</BoldText>
			</View>
		);
	}

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("Store")}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Stats
							</BoldText>
						</View>
					</View>

					<ScrollView
						style={{
							flex: 1,
							width: "100%",
							backgroundColor: "transparent",
						}}
						refreshControl={
							<RefreshControl
								refreshing={
									statNetworkStatus === NetworkStatus.refetch
								}
								onRefresh={() => refetchStat()}
							/>
						}
						showsVerticalScrollIndicator={false}
					>
						<View style={CommonStyles.section}>
							<BoldText style={CommonStyles.sectionHeader}>
								{store.name}'s Revenue
							</BoldText>

							{/*  Revenue by day */}
							<Text style={CommonStyles.sectionText}>
								Store's revenue{" "}
								{storeStat?.revenue.increase
									? "grew"
									: "dropped"}{" "}
								by {storeStat?.revenue.percentage.toString()}%
								this month
							</Text>

							<Graph
								labels={data[0]}
								data={data[1]}
								height={200}
								type={1}
							/>
						</View>

						<View style={CommonStyles.section}>
							<BoldText style={CommonStyles.sectionHeader}>
								Payment Breakdown
							</BoldText>
							<View style={styles.rowContainer}>
								<Text style={CommonStyles.sectionText}>
									Total Revenue
								</Text>
								<BoldText style={styles.amount}>
									₹ {storeStat?.revenue.value.toString()}/-
								</BoldText>
							</View>

							<View style={CommonStyles.seperator} />

							{gettingPaymentOptions ? (
								<View style={styles.sectionloading}>
									<ActivityIndicator color="#1ea472" />
								</View>
							) : (
								<View style={styles.paymentOptions}>
									{options.getPaymentOptions.map((obj: any) =>
										obj.data.map((payobj: any) => (
											<TouchableOpacity
												style={styles.optionBtn}
												key={obj.type}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "center",
														backgroundColor:
															"transparent",
													}}
												>
													<Text
														style={{
															...styles.optionText,

															color:
																Colors[
																	colorScheme
																]?.text ||
																"#111",
														}}
													>
														{payobj.type}
													</Text>
												</View>
												<BoldText style={styles.amount}>
													₹/-
												</BoldText>
											</TouchableOpacity>
										))
									)}
								</View>
							)}
						</View>

						<View style={CommonStyles.section}>
							<BoldText style={CommonStyles.sectionHeader}>
								{store.name}'s Orders
							</BoldText>

							{/* Number of orders this month */}
							<Text style={CommonStyles.sectionText}>
								Store saw{" "}
								{storeStat?.count.percentage.toString()}%{" "}
								{storeStat?.count.increase
									? "increase"
									: "decrease"}{" "}
								in orders this month
							</Text>

							<Graph
								labels={data[0]}
								data={data[2]}
								height={170}
								type={2}
							/>
						</View>
					</ScrollView>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	statsContainer: {
		flex: 1,
	},
	sectionloading: {
		height: 40,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	rowContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	amount: { fontSize: 16 },
	paymentOptions: {
		flexDirection: "column",
		alignItems: "center",
	},
	optionBtn: {
		flexDirection: "row",
		width: "100%",
		alignSelf: "auto",
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 5,
		marginBottom: 10,
		padding: 5,
	},
	optionText: { fontSize: 16 },
});
