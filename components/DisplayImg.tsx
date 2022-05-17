import React from "react";
import { BoldTitle, View } from "./Common/Themed";

interface DisplayImgProps {
	name: string;
	size?: number;
	off?: boolean;
}

export default function DisplayImg(props: DisplayImgProps) {
	return (
		<View
			style={{
				backgroundColor: props.off ? "#555" : "#111",
				justifyContent: "center",
				alignItems: "center",
				width: props.size ? props.size + 10 : "100%",
				height: props.size ? props.size + 10 : "100%",
				borderRadius: 500,
			}}
		>
			<BoldTitle
				style={{
					color: "#fff",
					fontSize: props.size ? props.size * 0.83 : 35,
				}}
			>
				{props.name.slice(0, 1)}
			</BoldTitle>
		</View>
	);
}
