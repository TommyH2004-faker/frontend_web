import React, {useEffect, useState} from "react";
import PlasticModels from "../../../models/PlasticModels";
import ImageModel from "../../../models/ImageModel";
import {lay1AnhCuaMotSach} from "../../../api/ImageApi";

interface CCarouselItemProps {
    doNhua1:PlasticModels;
}
const CCarouselItem: React.FC<CCarouselItemProps> = (props) => {
    const maNhua: number = props.doNhua1.idPlasticItem;
    const[danhsachAnh, setDanhSachAnh] = useState<ImageModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState<string | null>(null);
    useEffect(() => {
    lay1AnhCuaMotSach(maNhua).then(
    (hinhAnhData: ImageModel[]) => {
        setDanhSachAnh(hinhAnhData);
        setDangTaiDuLieu(false);
    }
).catch(
    (error: Error) => {
        setDangTaiDuLieu(false);
        setBaoLoi(error.message);
    }
);
    }, [maNhua]);

if(dangTaiDuLieu) {
    return (
        <div>
            <h1>Đang tải dữ liệu</h1>
        </div>
    );
}
if(baoLoi) {
    return (
        <div>
            <h1>Gặp lỗi: {baoLoi}</h1>
        </div>
    );
}
let duLieuAnh: string = "";
if(danhsachAnh[0] && danhsachAnh[0].urlImage) {
    duLieuAnh = danhsachAnh[0].urlImage;
}
    return (
        <div>
            <div className="row align-items-center">
                <div className="col-5 text-center">
                    <img src={duLieuAnh} className="float-end" style={{width: '300px'}}/>
                </div>
                <div className="col-7">
                    <h5>{props.doNhua1.namePlasticItem}</h5>
                    <p>{props.doNhua1.manufacturer}</p>
                </div>
            </div>
        </div>
    );
};

export default CCarouselItem;