import React from "react";
import Carousel from "./components/Carousel";
import Banner from "./components/Banner";
import PlasticCard from "../product/componetns/PlasticProps";
import PlasticList from "../product/PlasticList";
import DanhSachSanPham from "../product/DanhSachSanPham";
import {useParams} from "react-router-dom";
import BannerCarousel from "../header-footer/BannerCarousel";
interface HomePageProps {
    tuKhoaTimKiem: string;

}

function HomePage({tuKhoaTimKiem}: HomePageProps) {
const {idGenre} = useParams();
let idGenreNumber = 0;
try {
    idGenreNumber = parseInt(idGenre + '');

}catch (error) {
    idGenreNumber = 0;
    console.error('Error :', error);
}
if (Number.isNaN(idGenreNumber)) {
    idGenreNumber = 0;
}
    const images = [
        "/images/Plastics/banner1.jpg",
        "/images/Plastics/banner2.jpg",
        "/images/Plastics/banner3.jpg",
    ];
    return (
        <div>
            <BannerCarousel images={images}/>
            <Carousel/>
            <DanhSachSanPham tuKhoaTimKiem={tuKhoaTimKiem} idGenre={idGenreNumber}/>
        </div>

    );
}
export default HomePage;