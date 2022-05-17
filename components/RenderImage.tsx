import React, { useState, useEffect } from "react";
import { Image } from "react-native";

interface ImageInterface {
	url: string;
	factor: number;
}

export default function RenderImage(props: ImageInterface) {
	const [imgSize, setImgSize] = useState<object | null>(null);
	useEffect(() => {
		Image.getSize(props.url, (width, height) =>
			setImgSize({ imgWidth: width, imgHeight: height })
		);
	}, [props.url]);

	return (
		<Image
			style={{
				height: imgSize && imgSize.imgHeight * props.factor,
				width: imgSize && imgSize.imgWidth * props.factor,
			}}
			source={{ uri: props.url }}
			{...props}
		/>
	);
}
