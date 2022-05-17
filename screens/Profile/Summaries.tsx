import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	FlatList,
	Linking,
} from "react-native";

import {
	useMutation,
	useLazyQuery,
	useQuery,
	NetworkStatus,
} from "@apollo/client";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import {
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import { BoldText, Text } from "../../components/Common/Themed";
import TFA from "../../components/Auth/TFA";
import DynamicStatusBar from "../../components/Common/StatusBar";

import { TWOFACTOR_AUTH } from "../../graphql/authdefs";

import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

import { RootTabScreenProps } from "../../types";
import { CREATE_SUMMARY, GET_SUMMARIES } from "../../graphql/storedefs";
import moment from "moment";
import { STATIC_URI } from "../../constants/Urls";

export default function Summaries({
	navigation,
}: RootTabScreenProps<"Summaries">) {
	const colorScheme = useColorScheme();

	const [message, setMessage] = useState<string | any>("");
	const [fileType, setFileType] = useState<string | any>("EXCEL");

	const [summaries, setSummaries] = useState<any>([]);
	const [monthId, setMonthId] = useState<string | any>(null);

	const { user } = useSelector((state: any) => state.userReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const largeSnapPoints = useMemo(() => ["50%"], []);
	const handleSheetChanges = useCallback(() => {}, []);

	function showToast(message1: string, message2: string, type: number) {
		Toast.show({
			type: type === 1 ? "success" : "error",
			text1: message1,
			text2: message2,
		});
	}

	const [twoFactorAuth, { data: twoFactorData, loading: tfaLoading }] =
		useLazyQuery(TWOFACTOR_AUTH, {
			variables: {
				contact: user?.contact.number,
				newAcc: false,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.twoFactorAuth.error
					? setMessage("Account with this contact does not exist.")
					: bottomSheetModalRef.current?.present();
			},
			onError(err) {
				Alert.alert("Oops!", `${err}. Try Again`);
				process.env.NODE_ENV && console.log(err);
			},
		});

	const {
		loading: summaryLoading,
		refetch,
		networkStatus,
	} = useQuery(GET_SUMMARIES, {
		fetchPolicy: "no-cache",
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			setSummaries(data.getSummaries);
		},
		onError(err) {
			Alert.alert("Oops!", `${err}. Try Again`);
			process.env.NODE_ENV && console.log(err);
		},
	});

	const [createSummary, { data: summaryData, loading: creatingSummary }] =
		useMutation(CREATE_SUMMARY, {
			variables: {
				monthId,
				type: fileType,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				setMonthId(null);
				!data.createSummary.error &&
					handleOpenHelpUrl(`${STATIC_URI}${data.createSummary.url}`);
			},
			onError(err) {
				setMonthId(null);
				Alert.alert("Oops!", `${err}. Try Again`);
				process.env.NODE_ENV && console.log(err);
			},
		});

	// useEffect(() => {
	// 	showToast("Attention", message, 1);
	// }, [message]);

	useEffect(() => {
		monthId !== null && createSummary();
	}, [monthId]);

	function handleOpenHelpUrl(DOWNLOAD_URL: string) {
		Linking.canOpenURL(DOWNLOAD_URL)
			.then(() => {
				Linking.openURL(DOWNLOAD_URL).catch(
					(err) =>
						process.env.NODE_ENV &&
						console.log(`Error Occured: ${err}`)
				);
			})
			.catch(
				(err) =>
					process.env.NODE_ENV && console.log(`Error Occured: ${err}`)
			);
	}

	return (
		<>
			<TFA
				onCompleted={() => console.log("meow")}
				onDismiss={() => navigation.navigate("ProfileScreen")}
				bottomSheetModalRef={bottomSheetModalRef}
				snapPoints={largeSnapPoints}
				handleSheetChanges={handleSheetChanges}
				message={message}
				date={twoFactorData?.twoFactorAuth.date}
			/>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("ProfileScreen")}
						>
							<AntDesign
								name="back"
								size={25}
								color={Colors[colorScheme].text}
							/>
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Order Summary
							</BoldText>
						</View>
					</View>

					<Text style={styles.sectionText}>
						<Text style={{ color: "#1ea472" }}>Your summaries</Text>{" "}
						are a click away
					</Text>

					{summaryLoading ? (
						<LoadingContainer />
					) : summaries.length > 0 ? (
						<View style={{ flex: 1, width: "100%" }}>
							<FlatList
								onRefresh={() => refetch}
								refreshing={
									networkStatus === NetworkStatus.refetch
								}
								key={9980234511}
								keyExtractor={(e) => e.monthId}
								data={summaries}
								renderItem={({ item }) => (
									<View
										style={{
											width: "100%",
											flexDirection: "row",
											marginBottom: 10,
											justifyContent: "space-between",
											alignItems: "center",
											padding: 10,
											borderRadius: 10,
											paddingHorizontal: 10,
										}}
									>
										<Text
											style={{
												textDecorationLine: "underline",
												fontSize: 16,
											}}
										>
											{item.month}
										</Text>
										{creatingSummary &&
										monthId === item.monthId ? (
											<View style={styles.actionBtn}>
												<ActivityIndicator
													color={"#111"}
												/>
											</View>
										) : (
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
												}}
											>
												<TouchableOpacity
													style={{
														...styles.actionBtn,
														backgroundColor:
															monthId ===
															item.monthId
																? "#1ea47222"
																: "#eee",
													}}
													delayPressIn={0}
													disabled={
														item.monthId ===
															monthId ||
														creatingSummary
													}
													onPress={() => {
														setFileType("EXCEL");
														setMonthId(
															item.monthId
														);
													}}
												>
													<MaterialCommunityIcons
														name="file-excel"
														size={25}
														color="#111"
													/>
												</TouchableOpacity>
												{/* <TouchableOpacity
													style={{
														...styles.actionBtn,
														backgroundColor:
															monthId ===
															item.monthId
																? "#1ea47222"
																: "#eee",
													}}
													delayPressIn={0}
													disabled={
														item.monthId ===
															monthId ||
														creatingSummary
													}
													onPress={() => {
														setFileType("PDF");
														setMonthId(
															item.monthId
														);
													}}
												>
													<MaterialCommunityIcons
														name="file-pdf"
														size={25}
														color="#111"
													/>
												</TouchableOpacity> */}
											</View>
										)}
									</View>
								)}
							/>
						</View>
					) : (
						<View style={CommonStyles.loadingContainer}>
							<BoldText style={{ fontSize: 16 }}>
								Seems like{" "}
								<BoldText style={{ color: "#1ea472" }}>
									your store
								</BoldText>{" "}
								is less than a month old. Summary will be
								available on{" "}
								{moment(
									new Date(new Date().setDate(store.date))
								).format("ddd, hh:mm A")}
							</BoldText>
						</View>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	sectionText: { fontSize: 18, marginBottom: 10, width: "100%" },
	actionBtn: {
		height: 30,
		width: 30,
		marginLeft: 15,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
});
