import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PlasticModels from "../../../models/PlasticModels";
import ImageModel from "../../../models/ImageModel";
import { lay1AnhCuaMotSach } from "../../../api/ImageApi";
import dinhDangSo from "../../utils/dinhDangSo";
import renderRating from "../../utils/SaoXepHang";

interface PlasticProps {
    plasticItem: PlasticModels;
}

const PlasticCard: React.FC<PlasticProps> = ({ plasticItem }) => {
    const maNhua: number = plasticItem.idPlasticItem!;
    const [danhSachAnh, setDanhSachAnh] = useState<ImageModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState<string | null>(null);


    useEffect(() => {
        lay1AnhCuaMotSach(maNhua)
            .then((hinhAnhData) => {
                setDanhSachAnh(hinhAnhData);
                setDangTaiDuLieu(false);
            })
            .catch((error) => {
                setDangTaiDuLieu(false);
                setBaoLoi(error.message);
            });
    }, [maNhua]);



    const handleAddProduct = (item: PlasticModels) => {

    };
const  duLieuAnh=danhSachAnh.length > 0 ? danhSachAnh[0].urlImage : "";

    function handleFavoriteBook() {

    }

    return (
        <div className="col-md-3 mt-2">
            <div
                className="card"
                style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
                <Link to={`/plastic-items/${plasticItem.idPlasticItem}`}>
                    <img
                        src={duLieuAnh}
                        className="card-img-top"
                        alt={plasticItem.namePlasticItem}
                        style={{
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "10px",
                        }}
                    />
                </Link>

                <div className="card-body d-flex flex-column justify-content-between">
                    <Link
                        to={`/plastic-items/${plasticItem.idPlasticItem}`}
                        style={{textDecoration: "none"}}
                    >
                        <h5 className="card-title text-center">
                            {plasticItem.namePlasticItem}
                        </h5>
                        <h6 className="card-title text-center">
                            {plasticItem.manufacturer}
                        </h6>
                    </Link>

                    <div className="price row mt-2">
            <span className="original-price col-6 text-end text-muted">
              <del>{dinhDangSo(plasticItem.listPrice || 0)}</del>
            </span>
                        <span className="discounted-price col-6 text-end">
              <strong>{dinhDangSo(plasticItem.sellPrice || 0)}</strong>
            </span>
                    </div>

                    <div className="row mt-3">
                        <div className="col-6">
                            {renderRating(plasticItem.avgRating || 0)}
                        </div>
                        <div className="col-6 text-end">
                            <button className="btn btn-secondary btn-block me-2" onClick={handleFavoriteBook}>
                                <i className={`fas fa-heart`}></i>
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleAddProduct(plasticItem)}
                            >
                                <i className="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlasticCard;
