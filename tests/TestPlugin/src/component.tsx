import image from "./cute_kitten_stock_photo.jpg";
import { Component as SVG } from "./activity.svg";

export function Component() {
	return (
		<div>
			<strong>Wow this is a pretty cool component</strong>
			<img src={image} alt="cute kitten stock photo" />
			<SVG />
		</div>
	);
}
