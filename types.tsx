import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	Root: NavigatorScreenParams<RootTabParamList> | undefined;
	Splash: undefined;
	Onboarding: undefined;
	Login: undefined;
	SignUp: undefined;
	NotFound: undefined;
	Scan: undefined;
	Order: undefined;
	Selection: undefined;
	Summaries: undefined;
	Inventory: undefined;
	ManageInformation: undefined;
	ManagePayment: undefined;
	EditPin: undefined;
	EditStore: undefined;
	AccessPin: undefined;
	ProductInfo: undefined;
	Track: undefined;
	Stats: undefined;
	Product: undefined;
	Pay: undefined;
	Accounts: undefined;
	Modal: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
	Store: undefined;
	AllOrders: undefined;
	ProductScreen: undefined;
	ProfileScreen: undefined;
	Summaries: undefined;
	TrackDelivery: undefined;
	OrderScreen: undefined;
	Selection: undefined;
	ConfirmDetails: undefined;
	Inventory: undefined;
	Pay: undefined;
	EditStore: undefined;
	ProductInfo: undefined;
	EditPin: undefined;
	ModalScreen: undefined;
	Accounts: undefined;
	Stats: undefined;
	QuickBill: undefined;
	AccessPin: undefined;
	ManagePayment: undefined;
	ManageInformation: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>;
