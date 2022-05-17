import React, { useState, useEffect } from "react";

import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { View } from "./Common/Themed";
import ProductValueCard from "./ProductValueCard";
import { CommonStyles, LoadingContainer } from "./Common/Elements";

import { units } from "../constants/Units";
import { ADD_TO_INVENTORY } from "../graphql/inventorydefs";
import { GET_PRODUCT_INFO } from "../graphql/productdefs";

interface AddToInventoryProps {
	barcode: string;
	storeId: string;
	bottomSheetModalRef: any;
	next: any;
}

export default function AddToInventory(props: AddToInventoryProps) {
	const [editMode, setEditMode] = useState(true);
	const [productValue, setProductValue] = useState({
		brand: "",
		barcode: "",
		name: "",
		imageUrl: "",
		price: {
			mrp: "",
			sale: "",
		},
		itemQuantity: "0",
		quantity: {
			count: "",
			type: "",
		},
	});
	const [quantityState, setQuantityState] = useState(units[0]);

	const [fetchProduct, { loading: fetching }] = useLazyQuery(
		GET_PRODUCT_INFO,
		{
			variables: {
				barcode: props.barcode,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				if (data.getProductByBarcode) {
					setEditMode(false);
					setProductValue({
						...data.getProductByBarcode,
						itemQuantity: "0",
					});
				}
			},
		}
	);

	const [addToInventory, { loading: adding }] = useMutation(
		ADD_TO_INVENTORY,
		{
			variables: {
				inventoryProductInput: {
					...productValue,
					vendorName: null,
					ISD: null,
					number: null,
					barcode: props.barcode,
				},
				storeId: props.storeId,
			},
			onCompleted(data) {
				if (data.addToInventory) {
					setProductValue({
						brand: "",
						barcode: "",
						name: "",
						imageUrl: "",
						price: {
							mrp: "",
							sale: "",
						},
						itemQuantity: "0",
						quantity: {
							count: "",
							type: "",
						},
					});
					props.next();
					props.bottomSheetModalRef.current?.close();
				}
			},
		}
	);

	useEffect(() => {
		fetchProduct({ variables: { barcode: props.barcode } });
	}, []);

	return adding || fetching ? (
		<LoadingContainer />
	) : (
		<ProductValueCard
			productValue={productValue}
			setProductValue={setProductValue}
			setQuantityState={setQuantityState}
			quantityState={quantityState}
			editMode={editMode}
			addToInventory={addToInventory}
		/>
	);
}
