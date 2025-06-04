import React, {useEffect, useState} from "react";
import PlasticModels from "../../../models/PlasticModels";
import {get3DoNhuaMoiNhat} from "../../../api/PlasticApi";
import CCarouselItem from "./CCarouselItem";
const Carousel: React.FC = () => {
  const [danhsachDoNhua, setDanhSachDoNhua] = useState<PlasticModels[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState<string | null>(null);
    useEffect(() => {
      get3DoNhuaMoiNhat().then(
            kq => {
                setDanhSachDoNhua(kq.ketQua);
                setDangTaiDuLieu(false);
            }
        ).catch(
            error => {
                setDangTaiDuLieu(false);
                setBaoLoi(error.message);
            }
        );
    }, []);
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
  return (
      <div>
        <div id="carouselExampleDark" className="carousel carousel-dark slide">
          <div className="carousel-inner">
            <div className="carousel-item active" data-bs-interval="10000">
              <CCarouselItem doNhua1={danhsachDoNhua[0]} />
            </div>
            <div className="carousel-item " data-bs-interval="10000">
                <CCarouselItem doNhua1={danhsachDoNhua[1]} />
            </div>
            <div className="carousel-item " data-bs-interval="10000">
                <CCarouselItem doNhua1={danhsachDoNhua[2]} />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    );
}
export default Carousel;