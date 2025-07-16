/* eslint-disable @typescript-eslint/no-redeclare */
import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextEllipsis from "./text-ellipsis/TextEllipsis";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useConfirm } from "material-ui-confirm";
import { isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";

import { toast } from "react-toastify";
import CartItemModel from "../../../models/CartItemModel";
import ImageModel from "../../../models/ImageModel";

import SelectQuantity from "./select-quantity/SelectQuantity";
import {useCartItem} from "../../../models/CartItemContext";
import {layToanBoHinhAnhMotNhua} from "../../../api/ImageApi";

interface PlasticCartProps {
    cartItem: CartItemModel;
    handleRemoveBook: any;
}

const PlasticCartProps: React.FC<PlasticCartProps> = (props) => {
    const { setCartList } = useCartItem();

    const confirm = useConfirm();

    // Tạo các biến
    const [quantity, setQuantity] = useState(
        props.cartItem.plasticItem.quantity !== undefined
            ? props.cartItem.quantity > props.cartItem.plasticItem.quantity
                ? props.cartItem.plasticItem.quantity
                : props.cartItem.quantity
            : props.cartItem.quantity
    );
    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erroring, setErroring] = useState(null);

    function handleConfirm() {
        confirm({
            title: "Xoá sản phẩm",
            description: "Bạn muốn bỏ sản phẩm này khỏi giỏ hàng không",
            confirmationText: "Xoá",
            cancellationText: "Huỷ",
        })
            .then(() => {
                props.handleRemoveBook(props.cartItem.plasticItem.idPlasticItem);
                if (isToken()) {
                    const token = localStorage.getItem("token");
                    fetch(endpointBE + `/cart-items/${props.cartItem.idCart}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                    }).catch((err) => console.log(err));
                }
            })
            .catch(() => {});
    }

    // Lấy ảnh ra từ BE
    useEffect(() => {
        layToanBoHinhAnhMotNhua(props.cartItem.plasticItem.idPlasticItem)
            .then((response) => {
                console.log("Dữ liệu ảnh từ BE:", response); // Kiểm tra dữ liệu
                setImageList(response);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy ảnh:", error);
                setLoading(false);
                setErroring(error.message);
            });
    }, [props.cartItem.plasticItem.idPlasticItem]);

    // Loading ảnh thumbnail
    let dataImage;
    if (imageList.length > 0) {
        const thumbnail = imageList.filter((i) => i.thumbnail);
        if (thumbnail.length > 0) {
            dataImage = thumbnail[0].urlImage || thumbnail[0].dataImage;
        } else {
            dataImage = imageList[0].urlImage || imageList[0].dataImage; // fallback ảnh đầu tiên
        }
    }
  /*  dataImage = imageList.find(i => i.thumbnail)?.urlImage || imageList[0]?.urlImage;*/


    // Xử lý tăng số lượng
    const add = () => {
        if (quantity) {
            if (
                quantity <
                (props.cartItem.plasticItem.quantity ? props.cartItem.plasticItem.quantity : 1)
            ) {
                setQuantity(quantity + 1);
                handleModifiedQuantity(props.cartItem.plasticItem.idPlasticItem, 1);
            } else {
                toast.warning("Số lượng tồn kho không đủ");
            }
        }
    };

    // Xử lý giảm số lượng
    const reduce = () => {
        if (quantity) {
            if (quantity - 1 === 0) {
                handleConfirm();
            } else if (quantity > 1) {
                setQuantity(quantity - 1);
                handleModifiedQuantity(props.cartItem.plasticItem.idPlasticItem, -1);
            }
        }
    };

    // Xử lý cập nhật lại quantity trong localstorage / database
    function handleModifiedQuantity(idPlatic: number, quantity: number) {
        const cartData: string | null = localStorage.getItem("cart");
        const cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];
        // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
        let isExistBook = cart.find(
            (cartItem) => cartItem.plasticItem.idPlasticItem === idPlatic);
        // Thêm 1 sản phẩm vào giỏ hàng
        if (isExistBook) {
            // nếu có rồi thì sẽ tăng số lượng
            isExistBook.quantity += quantity;

            // Cập nhật trong db
            if (isToken()) {
                const token = localStorage.getItem("token");
                fetch(endpointBE + `/cart-item/update-item`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        idCart: props.cartItem.idCart,
                        quantity: isExistBook.quantity,
                    }),
                }).catch((err) => console.log(err));
            }
        }
        // Cập nhật lại
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartList(cart);
    }

    if (loading) {
        return (
            <>
                <Skeleton className='my-3' variant='rectangular' />
            </>
        );
    }

    if (erroring) {
        return (
            <>
                <h4>Lỗi ...</h4>
            </>
        );
    }
    return (
        <>
            <div className='col'>
                <div className='d-flex'>
                    <Link to={`/plastic-items/${props.cartItem.plasticItem.idPlasticItem}`}>
                        <img
                            src={dataImage}
                            className='card-img-top'
                            alt={props.cartItem.plasticItem.namePlasticItem}
                            style={{ width: "100px" }}
                        />
                    </Link>
                    <div className='d-flex flex-column pb-2'>
                        <Link to={`/plastic-items/${props.cartItem.plasticItem.idPlasticItem}`}>
                            <Tooltip title={props.cartItem.plasticItem.namePlasticItem} arrow>
								<span className='d-inline'>
									<TextEllipsis
                                        text={props.cartItem.plasticItem.namePlasticItem + " "}
                                        limit={38}
                                    />
								</span>
                            </Tooltip>
                        </Link>
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
            <div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
                <SelectQuantity
                    max={props.cartItem.plasticItem.quantity}
                    setQuantity={setQuantity}
                    quantity={quantity}
                    add={add}
                    reduce={reduce}
                    plastic={props.cartItem.plasticItem}
                />
            </div>
            <div className='col-2 text-center my-auto'>
				<span className='text-danger'>
					<strong>
						{(quantity * props.cartItem.plasticItem.sellPrice).toLocaleString()}đ
					</strong>
				</span>
            </div>
            <div className='col-2 text-center my-auto'>
                <Tooltip title={"Xoá sản phẩm"} arrow>
                    <button
                        style={{
                            outline: 0,
                            backgroundColor: "transparent",
                            border: 0,
                        }}
                        onClick={() => handleConfirm()}
                    >
                        <DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} />
                    </button>
                </Tooltip>
            </div>
            <hr className='my-3' />
        </>
    );
};

export default PlasticCartProps;
