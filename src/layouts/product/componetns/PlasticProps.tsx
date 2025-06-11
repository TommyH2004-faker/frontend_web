import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ImageModel from "../../../models/ImageModel";

import dinhDangSo from "../../utils/dinhDangSo";
import renderRating from "../../utils/SaoXepHang";

import { getIdUserByToken, isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { toast } from "react-toastify";
import PlasticModels from "../../../models/PlasticModels";
import {lay1AnhCuaMotNhua} from "../../../api/ImageApi";
import {useCartItem} from "../../../models/CartItemContext";

interface PlasticPropsInterface {
    plastic: PlasticModels;
}

const PlasticProps: React.FC<PlasticPropsInterface> = ({ plastic}) => {
    const maNhua: number = plastic.idPlasticItem;
    const [danhSachAnh, setDanhSachAnh] = useState<ImageModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState<string | null>(null);
    const { setTotalCart, cartList } = useCartItem();

    const [isFavoriteBook, setisFavoriteBook] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        lay1AnhCuaMotNhua(maNhua)
            .then(hinhAnhData => {
                setDanhSachAnh(hinhAnhData);
                setDangTaiDuLieu(false);
            })
            .catch(error => {
                setDangTaiDuLieu(false);
                setBaoLoi(error.message);
            });

        if (isToken()) {
            fetch(endpointBE + `/favorite-plastic/get-favorite-plastic/${getIdUserByToken()}`)
                .then(response => response.json())
                .then(data => {
                    if (data.includes(maNhua)) {
                        setisFavoriteBook(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [maNhua]);

    const handleAddProduct = async (newPlastic: PlasticModels) => {
        let isExistBook = cartList.find(cartItem =>
            cartItem.plasticItem?.idPlasticItem === newPlastic.idPlasticItem
        );

        if (isExistBook) {
            isExistBook.quantity += 1;

            if (isToken()) {
                const request = {
                    idCart: isExistBook.idCart,
                    quantity: isExistBook.quantity,
                };
                const token = localStorage.getItem("token");
                fetch(endpointBE + `/cart-item/update-item`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(request),
                }).catch(err => console.log(err));
            }
        } else {
            if (isToken()) {
                try {
                    const request = [
                        {
                            quantity: 1,
                            plasticItem: newPlastic,
                            idUser: getIdUserByToken(),
                        },
                    ];



                    const token = localStorage.getItem("token");
                    const response = await fetch(endpointBE + "/cart-item/add-item", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(request),
                    });

                    if (response.ok) {
                        const idCart = await response.json();
                        cartList.push({
                            idCart: idCart,
                            quantity: 1,
                            plasticItem: newPlastic,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                // 🟢 Trường hợp không đăng nhập: vẫn đảm bảo đúng cấu trúc
                cartList.push({
                    idCart: null,
                    quantity: 1,
                    plasticItem: newPlastic,
                });
            }
        }

        localStorage.setItem("cart", JSON.stringify(cartList));
        toast.success("Thêm vào giỏ hàng thành công");
        setTotalCart(cartList.length);
    };


    /*const handleFavoritPlastic = async () => {
        if (!isToken()) {
            toast.info("Bạn phải đăng nhập để sử dụng chức năng này");
            navigation("/dangnhap");
            return;
        }

        const token = localStorage.getItem("token");
        const url = isFavoriteBook
            ? endpointBE + `/favorite-plastic/delete-plastic`
            : endpointBE + `/favorite-plastic/add-plastic`;

        fetch(url, {
            method: isFavoriteBook ? "DELETE" : "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                idPlastic: plastic.idPlasticItem,
                idUser: getIdUserByToken(),
            }),
        }).catch(err => console.log(err));

        setIsFavoriteBook(!isFavoriteBook);
    };*/
    const handleFavoritPlastic = async () => {
        if (!isToken()) {
            toast.info("Bạn phải đăng nhập để sử dụng chức năng này");
            navigation("/dangnhap");
            return;
        }

        const token = localStorage.getItem("token");

        const url = isFavoriteBook
            ? endpointBE + `/favorite-plastic/delete-plastic`
            : endpointBE + `/favorite-plastic/add-plastic`;

        const body = {
            user: {
                idUser: getIdUserByToken()
            },
            plasticItem: {
                idPlasticItem: plastic.idPlasticItem
            }
        };

        try {
            const response = await fetch(url, {
                method: isFavoriteBook ? "DELETE" : "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Thao tác thất bại");
            }

            setisFavoriteBook(!isFavoriteBook);

            // ✅ Hiển thị thông báo sau khi thành công
            if (isFavoriteBook) {
                toast.success("Đã xóa khỏi danh sách yêu thích");
            } else {
                toast.success("Đã thêm vào danh sách yêu thích");
            }
        } catch (err) {
            console.log(err);
            toast.error("Không thể cập nhật danh sách yêu thích");
        }
    };


    if (dangTaiDuLieu) {
        return <h1>Đang tải dữ liệu...</h1>;
    }

    if (baoLoi) {
        return <h1>Gặp lỗi: {baoLoi}</h1>;
    }

    const duLieuAnh = danhSachAnh.length > 0 ? danhSachAnh[0].urlImage : "";

    return (
        <div className="col-md-3 mt-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Link to={`/plastic-items/${plastic.idPlasticItem}`}>
                    <img
                        src={duLieuAnh}
                        className="card-img-top"
                        alt={plastic.namePlasticItem}
                        style={{ height: "250px", objectFit: "cover", borderRadius: "10px" }}
                    />
                </Link>
                <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Link to={`/plastic-items/${plastic.idPlasticItem}`} style={{textDecoration: 'none'}}>
                        <h5 className="card-title" style={{minHeight: "50px", textAlign: "center"}}>
                            {plastic.namePlasticItem}
                        </h5>
                        <h6 className="card-title" style={{minHeight: "50px", textAlign: "center"}}>
                            {plastic.manufacturer}
                        </h6>
                    </Link>

                    <div className="price row" style={{minHeight: "40px"}}>
                        <span className="original-price col-6 text-end">
                            <del>{dinhDangSo(plastic.listPrice)}</del>
                        </span>
                        <span className="discounted-price col-6 text-end">
                            <strong>{dinhDangSo(plastic.sellPrice)} đ</strong>
                        </span>
                    </div>

                    <div className="row mt-2" role="group">
                        <div className="col-6">
                            {renderRating(plastic.avgRating || 0)}
                        </div>
                        <div className="col-6 text-end">
                            <button className="btn btn-secondary btn-block me-2" onClick={handleFavoritPlastic}>
                                <i className={`fas fa-heart ${isFavoriteBook ? "text-danger" : ""}`}></i>
                            </button>
                            <button className="btn btn-danger btn-block" onClick={() => handleAddProduct(plastic)}>
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlasticProps;
