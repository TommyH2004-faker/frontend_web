import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

import { Button, Chip } from "@mui/material";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import DoneIcon from "@mui/icons-material/Done";


import { Link } from "react-router-dom";
import CartItemModel from "../../../models/CartItemModel";
import ImageModel from "../../../models/ImageModel";
import {layToanBoHinhAnhMotNhua} from "../../../api/ImageApi";
import TextEllipsis from "./text-ellipsis/TextEllipsis";
import {FadeModal} from "../../utils/FadeModal";
import {ReviewForm} from "./review/ReviewForm";




interface PlasticHorizontalProps {
	cartItem: CartItemModel;
	type?: any;
	idOrder?: number;
	handleCloseModalOrderDetail?: any;
	statusOrder?: string;

}

export const PlasticHorizontal: React.FC<PlasticHorizontalProps> = (props) => {
	// Mở/Đóng modal
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [cartItem, setCartItem] = useState<CartItemModel>(props.cartItem);

	const [imageList, setImageList] = useState<ImageModel[]>([]);
	// Lấy ảnh ra từ BE
	useEffect(() => {
		if (!props.cartItem || !props.cartItem.plasticItem) {
			console.warn("cartItem hoặc book bị undefined:", props.cartItem);
			return;
		}

		layToanBoHinhAnhMotNhua(props.cartItem.plasticItem.idPlasticItem)
			.then((response) => {
				setImageList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [props.cartItem?.plasticItem?.idPlasticItem]);

	// Loading ảnh thumbnail
	let dataImage;
	if (imageList.length > 0) {
		const thumbnail = imageList.find((i) => i.thumbnail);
		const fallbackImage = imageList[0];
		dataImage = (thumbnail?.urlImage || thumbnail?.dataImage) ?? (fallbackImage.urlImage || fallbackImage.dataImage);
	}

	return (
		<div className='row'>
			<div className='col'>
				<div className='d-flex'>
					<img
						src={dataImage}
						className='card-img-top'
						alt={props.cartItem.plasticItem.namePlasticItem}
						style={{ width: "100px" }}
					/>
					<div className='d-flex flex-column pb-2'>
						<Tooltip title={props.cartItem.plasticItem.namePlasticItem} arrow>
							<Link
								to={`/book/${props.cartItem.plasticItem.idPlasticItem}`}
								className='d-inline text-black'
							>
								<TextEllipsis
									text={props.cartItem.plasticItem.namePlasticItem + " "}
									limit={100}
								/>
							</Link>
						</Tooltip>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.plasticItem.sellPrice.toLocaleString()}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.plasticItem.listPrice.toLocaleString()}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-2 text-center'>
				<strong>{props.cartItem.quantity}</strong>
			</div>
			<div className='col-2 text-center'>
				<span className='text-danger'>
					<strong>
						{(
							props.cartItem.quantity * props.cartItem.plasticItem.sellPrice
						).toLocaleString()}
						đ
					</strong>
				</span>
			</div>
			{props.type === "view-customer" &&
				props.statusOrder === "Thành công" && (
					<div className='d-flex flex-row-reverse'>
						{props.cartItem.review === false ? (
							<>
								<Button
									variant='outlined'
									size='small'
									startIcon={<RateReviewRoundedIcon />}
									style={{ width: "150px" }}
									onClick={handleOpenModal}
								>
									Viết đánh giá
								</Button>
							</>
						) : (
							<>
								<Button
									className='mx-3'
									variant='outlined'
									size='small'
									startIcon={<RateReviewRoundedIcon />}
									style={{ width: "150px" }}
									onClick={handleOpenModal}
								>
									Xem đánh giá
								</Button>
								<Chip
									color='primary'
									label='Bạn đã đánh giá sản phẩm này rồi'
									icon={<DoneIcon />}
								/>
							</>
						)}
						<FadeModal
							open={openModal}
							handleOpen={handleOpenModal}
							handleClose={handleCloseModal}
						>
							<ReviewForm
								idOrder={props.idOrder ? props.idOrder : 0}
								idBook={props.cartItem.plasticItem.idPlasticItem}
								handleCloseModal={handleCloseModal}
								handleCloseModalOrderDetail={
									props.handleCloseModalOrderDetail
								}
								cartItem={cartItem}
								setCartItem={setCartItem}
							/>
						</FadeModal>
					</div>
				)}
			<hr className='mt-3' />
		</div>
	);
};
export default PlasticHorizontal;
