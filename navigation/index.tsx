import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/Misc/NotFoundScreen";

import Store from "../screens/Store";
import AllOrders from "../screens/AllOrders";
import QuickBill from "../screens/QuickBill";
import ProfileScreen from "../screens/Profile";

import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";

import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import SplashScreen from "../screens/SplashScreen";
import Selection from "../screens/Selection";
import Summaries from "../screens/Profile/Summaries";
import ManageInformation from "../screens/Profile/Information";
import ManagePayment from "../screens/Profile/ManagePayment";
import EditStore from "../screens/Profile/EditStore";
import Onboarding from "../screens/Auth/Onboarding";
import ProductInfo from "../screens/ProductInfo";
import Pay from "../screens/Pay";
import AccessPin from "../screens/AccessPin";
import Accounts from "../screens/Profile/Accounts";
import EditPin from "../screens/Profile/EditPin";
import Stats from "../screens/Stats";

export default function Navigation({
	colorScheme,
}: {
	colorScheme: ColorSchemeName;
}) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
		>
			<RootNavigator />
		</NavigationContainer>
	);
}
/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Splash"
				component={SplashScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Onboarding"
				component={Onboarding}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="SignUp"
				component={SignUpScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Root"
				component={BottomTabNavigator}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: "Oops!" }}
			/>
			<Stack.Group
				screenOptions={{
					presentation: "modal",
					headerShown: false,
				}}
			>
				<Stack.Screen name="Selection" component={Selection} />
				<Stack.Screen name="Accounts" component={Accounts} />
				<Stack.Screen name="Scan" component={QuickBill} />
				<Stack.Screen
					name="ManageInformation"
					component={ManageInformation}
				/>
				<Stack.Screen name="Stats" component={Stats} />
				<Stack.Screen name="Summaries" component={Summaries} />
				<Stack.Screen name="Pay" component={Pay} />
				<Stack.Screen name="ManagePayment" component={ManagePayment} />
				<Stack.Screen name="EditPin" component={EditPin} />
				<Stack.Screen name="EditStore" component={EditStore} />
				<Stack.Screen name="AccessPin" component={AccessPin} />
				<Stack.Screen name="ProductInfo" component={ProductInfo} />
			</Stack.Group>
		</Stack.Navigator>
	);
}
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme = useColorScheme();

	return (
		<BottomTab.Navigator
			initialRouteName="Store"
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme].tint,
				tabBarShowLabel: false,
				tabBarStyle: {
					borderRadius: 5,
					marginBottom: "5%",
					width: "90%",
					alignSelf: "center",
					backgroundColor: Colors[colorScheme].background,
				},
			}}
		>
			<BottomTab.Screen
				name="Store"
				component={Store}
				options={() => ({
					title: "Store",
					tabBarHideOnKeyboard: true,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon2 name="store" color={color} />
					),
				})}
			/>
			<BottomTab.Screen
				name="AllOrders"
				component={AllOrders}
				options={() => ({
					title: "AllOrders",
					tabBarHideOnKeyboard: true,
					headerShown: false,
					lazy: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="profile" color={color} />
					),
				})}
			/>
			<BottomTab.Screen
				name="QuickBill"
				component={QuickBill}
				options={() => ({
					title: "QuickBill",
					tabBarHideOnKeyboard: true,
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="scan1" color={color} />
					),
					unmountOnBlur: true,
				})}
			/>
			<BottomTab.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				options={() => ({
					title: "Profile",
					headerShown: false,
					lazy: false,
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="user" color={color} />
					),
				})}
			/>
		</BottomTab.Navigator>
	);
}
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
	name: React.ComponentProps<typeof AntDesign>["name"];
	color: string;
}) {
	return <AntDesign size={24} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIcon2(props: {
	name: React.ComponentProps<typeof MaterialIcons>["name"];
	color: string;
}) {
	return <MaterialIcons size={32} style={{ marginBottom: -3 }} {...props} />;
}
