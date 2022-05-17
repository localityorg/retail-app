import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { StyleSheet, View, FlatList } from "react-native";

import * as Notifications from "expo-notifications";
import { useQuery } from "@apollo/client";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

import { BoldText } from "../../components/Common/Themed";
import {
	CommonStyles,
	CategoryBtn,
	CategoryBtnText,
	LoadingContainer,
} from "../../components/Common/Elements";
import NewOrderCard from "../../components/AllOrders/NewOrderCard";
import TrackContent from "../../components/AllOrders/TrackContent";
import DynamicStatusBar from "../../components/Common/StatusBar";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

import { AuthContext } from "../../context/auth";
import { filterOrders } from "../../util/filters";
import { setUserOrders } from "../../redux/actions";

import { GET_NEW_ORDER, GET_ORDERS } from "../../graphql/orderDefs";

import { RootTabScreenProps } from "../../types";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

async function schedulePushNotification(title: string, message: string) {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: title,
			body: message,
			data: { data: "goes here" },
		},
		trigger: {
			seconds: 1,
		},
	});
}

const filters = [
	{ id: 19349, name: "Whole list" },
	{ id: 19345, name: "Delivered" },
	{ id: 19348, name: "Pending" },
	{ id: 19347, name: "Confirmed" },
	{ id: 19346, name: "Cancelled" },
];

export default function AllOrders({
	navigation,
}: RootTabScreenProps<"AllOrders">) {
	const context = useContext(AuthContext);
	const dispatch = useDispatch();
	const [visible, setVisible] = useState(true);
	const [code, setCode] = useState("");
	const [filter, setFilter] = useState<any>(filters[0]);
	const [isRender, setIsRender] = useState(false);
	const [focusId, setFocusId] = useState(null);
	const [orders, setOrders] = useState<any>([]);
	const bottomSheetTrackModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["80%"], []);
	const handleSheetChanges = useCallback(() => {}, []);

	const { userOrders } = useSelector((state: any) => state.ordersReducer);

	const {
		data: allOrders,
		loading,
		subscribeToMore,
		refetch,
		networkStatus,
	} = useQuery(GET_ORDERS, {
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			setOrders(data.getOrders);
			dispatch(setUserOrders(data?.getOrders));
		},
		onError(err) {
			console.log(err);
		},
	});

	useEffect(() => {
		subscribeToMore({
			document: GET_NEW_ORDER,
			variables: { id: context?.user?.id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const updatedQueryData = subscriptionData.data.newOrder;
				const index = prev.getOrders.findIndex(
					(e: any) => e.id === updatedQueryData.id
				);

				if (index <= -1) {
					schedulePushNotification(
						"New Order recieved!",
						"Accept to notify the user."
					);
					dispatch(
						setUserOrders([updatedQueryData, ...prev.getOrders])
					);
					setIsRender(!isRender);
					return Object.assign({}, prev, {
						getOrders: [updatedQueryData, ...prev.getOrders],
					});
				} else {
					var updatedOrders = [...prev.getOrders];
					updatedOrders.splice(index, 1);
					dispatch(
						setUserOrders([updatedQueryData, ...updatedOrders])
					);
					setIsRender(!isRender);
					return Object.assign({}, prev, {
						getOrders: [updatedQueryData, ...updatedOrders],
					});
				}
			},
		});
	}, []);

	// useEffect(() => {
	// 	!settings.pinState && navigation.navigate("AccessPin");
	// }, []);

	function handleFilter(item: any) {
		setFilter(item);
	}

	useEffect(() => {
		allOrders?.getOrders && setIsRender(!isRender);
	}, [allOrders]);

	useEffect(() => {
		const filteredOrders = filterOrders(allOrders?.getOrders || [], filter);
		setOrders(filteredOrders);
	}, [filter]);

	function RenderItem({ item }: any) {
		return (
			<NewOrderCard
				data={item}
				dispatch={dispatch}
				onPress={() => {
					setFocusId(item.id);
					bottomSheetTrackModalRef.current?.present();
				}}
			/>
		);
	}

	const memoizedValue = useMemo(() => RenderItem, [allOrders?.getOrders]);

	if (loading || networkStatus === 4) {
		return <LoadingContainer />;
	}

	return (
		<>
			<BottomSheetModal
				style={{ borderRadius: 20 }}
				ref={bottomSheetTrackModalRef}
				key={9772738821}
				onChange={handleSheetChanges}
				backdropComponent={CustomBackdrop}
				snapPoints={snapPoints}
			>
				{!focusId ? (
					<LoadingContainer />
				) : (
					<TrackContent
						data={allOrders?.getOrders.find(
							(e: any) => e.id === focusId
						)}
					/>
				)}
			</BottomSheetModal>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								All Orders
							</BoldText>
						</View>
					</View>
					<FlatList
						ListHeaderComponent={
							<View style={{ width: "100%", marginBottom: 10 }}>
								<FlatList
									horizontal
									showsHorizontalScrollIndicator={false}
									data={filters}
									keyExtractor={(e) => e.id.toString()}
									renderItem={({ item }) => (
										<CategoryBtn
											active={item === filter}
											onPress={() => handleFilter(item)}
										>
											<CategoryBtnText
												active={item === filter}
											>
												{item.name}
											</CategoryBtnText>
										</CategoryBtn>
									)}
								/>
							</View>
						}
						data={userOrders}
						extraData={isRender}
						renderItem={memoizedValue}
						refreshing={loading || networkStatus === 4}
						onRefresh={() => refetch()}
						showsVerticalScrollIndicator={false}
						keyExtractor={(e) => e.id}
					/>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	orderContainer: {
		backgroundColor: "#1ea47233",
		borderRadius: 15,
		borderColor: "#1ea47222",
		borderWidth: 2,
		width: "100%",
		padding: 10,
		marginBottom: 10,
	},
	products: {
		flexDirection: "column",
	},
	product: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	productText: {
		flex: 1,
		marginVertical: 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	seperator: {
		width: "100%",
		backgroundColor: "#ccc",
		height: 1,
		marginVertical: 10,
	},
	actionContainer: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		padding: 5,
		marginRight: 10,
		borderRadius: 12,
	},
});

const otpInputStyles = StyleSheet.create({
	underlineStyleBase: {
		width: 30,
		height: 45,
		color: "#111",
		fontSize: 20,
		borderWidth: 0,
		borderBottomWidth: 2,
	},
	underlineStyleHighLighted: {
		borderColor: "#1ea472",
	},
});
