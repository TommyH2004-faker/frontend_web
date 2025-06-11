/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import { getAllReview } from "../../../../api/ReviewApi";
import ReviewModel from "../../../../models/ReviewModel";


import RatingStar from "../rating/Rating";
import User from "../../user/User";


interface CommentProps {
	idPlastic: number;
}

const Comment: React.FC<CommentProps> = (props) => {
	const [reviews, setReviews] = useState<ReviewModel[] | null>(null);
	useEffect(() => {
		getAllReview(props.idPlastic).then((respose) => {
			setReviews(respose);
		});
	}, []);

	if (reviews?.length === 0) {
		return <p>Không có đánh giá nào</p>;
	}

	return (
		<>
			{reviews?.map((review, index) => {
				return (
					<div className='mb-3' key={index}>
						<div className='d-flex'>
							<User review={review}>
								<div>
									<RatingStar
										readonly={true}
										ratingPoint={review.ratingPoint}
									/>
									<p className='mb-0'>{review.content}</p>
								</div>
							</User>
						</div>
					</div>
				);
			})}
		</>
	);
};

export default Comment;
