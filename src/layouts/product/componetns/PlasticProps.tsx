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
        let isExistPlastic = cartList.find(cartItem =>
            cartItem.plasticItem && cartItem.plasticItem.idPlasticItem === newPlastic.idPlasticItem
        );

        if (isExistPlastic) {
            isExistPlastic.quantity += 1;

            if (isToken()) {
                const request = {
                    idCart: isExistPlastic.idCart,
                    quantity: isExistPlastic.quantity,
                };
                const token = localStorage.getItem("token");
                fetch(endpointBE + `/cart-item/update-item`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(request),
                }).catch((err) => console.log(err));
            }
        } else {
            if (isToken()) {
                try {
                    // Xóa thuộc tính thumbnail nếu nó là undefined
                    const cleanedPlastic = { ...newPlastic };
                    if (cleanedPlastic.thumbnail === undefined) {
                        delete cleanedPlastic.thumbnail;
                    }

                    const request = [
                        {
                            quantity: 1,
                            plastic: cleanedPlastic,
                            idUser: getIdUserByToken(),
                        },
                    ];

                    console.log("Dữ liệu gửi lên: ", request);

                    const token = localStorage.getItem("token");
                    const response = await fetch(endpointBE + "/cart-item/add-item", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(request),
                    });

                    console.log("Response: ", response);

                    if (response.ok) {
                        const idCart = await response.json();
                        cartList.push({
                            idCart: idCart,
                            quantity: 1,
                            plasticItem: newPlastic,
                        });
                    } else {
                        const errorMessage = await response.text();
                        console.error("Lỗi phản hồi server: ", errorMessage);
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                cartList.push({
                    quantity: 1,
                    plasticItem: newPlastic,
                });
            }
        }

        localStorage.setItem("cart", JSON.stringify(cartList));
        toast.success("Thêm vào giỏ hàng thành công");
        setTotalCart(cartList.length);
    };
   /* const handleAddProduct = async (newPlastic: PlasticModels) => {
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
                    /!*const request =
                        {
                            quantity: 1,
                            plasticItem: newPlastic,
                            idUser: getIdUserByToken(),
                        }*!/
                    const request =[
                        {
                        quantity: 1,
                        plasticItem: newPlastic,
                        idUser: getIdUserByToken(),
                    },
                ]


                    const token = localStorage.getItem("token");
                    const response = await fetch(endpointBE + "/cart-item/add-item", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(request),
                    });
                    // ✅ Kiểm tra phản hồi từ server
                    console.log("Du lieu gửi đi:", request);
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
                    quantity: 1,
                    plasticItem: newPlastic,
                });
            }
        }

        localStorage.setItem("cart", JSON.stringify(cartList));
        toast.success("Thêm vào giỏ hàng thành công");
        setTotalCart(cartList.length);
    };*/


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
            <div className="card shadow-sm h-100 d-flex flex-column">
                <Link to={`/plastic-items/${plastic.idPlasticItem}`}>
                    <img
                        src={duLieuAnh}
                        className="card-img-top"
                        style={{
                            height: "200px",
                            objectFit: "cover",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px"
                        }}
                    />
                </Link>

                <div className="card-body d-flex flex-column justify-content-between">
                    <Link to={`/plastic-items/${plastic.idPlasticItem}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h5 className="card-title text-center" style={{ minHeight: "48px" }}>
                            {plastic.namePlasticItem}
                        </h5>
                        <h6 className="card-subtitle text-muted text-center mb-2" style={{ minHeight: "24px" }}>
                            {plastic.manufacturer}
                        </h6>
                    </Link>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">
                        <del>{dinhDangSo(plastic.listPrice)} đ</del>
                    </span>
                        <span className="text-danger fw-bold">
                        {dinhDangSo(plastic.sellPrice)} đ
                    </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div>{renderRating(plastic.avgRating || 0)}</div>
                        <div className="d-flex gap-2">
                            <button
                                className={`btn btn-sm ${isFavoriteBook ? "btn-danger" : "btn-outline-secondary"}`}
                                onClick={handleFavoritPlastic}
                            >
                                <i className={`fas fa-heart ${isFavoriteBook ? "" : "text-muted"}`}></i>
                            </button>
                            <button className="btn btn-sm btn-success" onClick={() => handleAddProduct(plastic)}>
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
