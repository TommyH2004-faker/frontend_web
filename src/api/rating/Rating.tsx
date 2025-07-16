/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Rating from "@mui/material/Rating";
import React from "react";

interface RatingStarProps {
	readonly?: boolean; // readonly là thuộc tính để xác định xem đánh giá có thể chỉnh sửa hay không
	ratingPoint?: number; // ratingPoint là điểm đánh giá, có thể là số thập phân (ví dụ: 4.5)
}

const RatingStar: React.FC<RatingStarProps> = (props) => {
	const [value, setValue] = React.useState<number | null>(
		props.ratingPoint || 0
	);

	return (
		<Rating
			name='half-rating'
			value={value}
			precision={0.5}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			readOnly={props.readonly}
			size='small'
		/>
	);
};

export default RatingStar;
