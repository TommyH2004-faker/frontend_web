import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import PlasticModels from "../../models/PlasticModels";
import { layPlasticbyId } from "../../api/PlasticApi";
import ImageModel from "../../models/ImageModel";
import { layToanBoHinhAnhMotSach } from "../../api/ImageApi";
import { Rating } from "@mui/material";
import GenreModel from "../../models/GenreModel";
import {getGenreById} from "../../api/GenresApi";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Carousel } from 'react-responsive-carousel';


interface ChiTietSanPhamProps {}

const ChiTietSanpham: React.FC<ChiTietSanPhamProps> = () => {
    useScrollToTop();

    const { idPlastic } = useParams();
    let idPlasticNumber = 0;

    try {
        idPlasticNumber = parseInt(idPlastic + '');
        if (Number.isNaN(idPlasticNumber)) {
            idPlasticNumber = 0;
        }
    } catch (error) {
        idPlasticNumber = 0;
        console.error('Error:', error);
    }

    const [plastic, setPlastic] = useState<PlasticModels | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<ImageModel[] | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        layPlasticbyId(idPlasticNumber)
            .then((response) => {
                setPlastic(response);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [idPlasticNumber]);

    useEffect(() => {
        layToanBoHinhAnhMotSach(idPlasticNumber)
            .then((response) => {
                setImages(response);
            })
            .catch((error) => {
                console.error('Error fetching images:', error);
            });
    }, [idPlasticNumber]);


    const [genres, setGenres] = useState<GenreModel[] | null>(null);
    useEffect(() => {
        getGenreById(idPlasticNumber).then((response) => {
            setGenres(response.genreList);
        });
    }, []);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImageIndex(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImageIndex(0);
        setIsViewerOpen(false);
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    if (!plastic) return <div>Không tìm thấy sản phẩm nhựa.</div>;

    const imageList: string[] = (images ?? [])
        .map(img => img.urlImage || img.dataImage)
        .filter((url): url is string => Boolean(url));

    return (

        <div className='col-lg-8 col-md-8 col-sm-12 px-5'>
            <div className='mt-4 d-flex'>
                <Carousel
                    emulateTouch={true}
                    swipeable={true}
                    showIndicators={false}
                >
                    {images?.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => openImageViewer(index)}
                            style={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                            }}
                        >
                            <img
                                alt=''
                                src={
                                    image.dataImage
                                        ? image.dataImage
                                        : image.urlImage
                                }
                            />
                        </div>
                    ))}
                </Carousel>
                {imageList.map((url, index) => (
                    <img
                        key={index}
                        src={url || undefined}
                        alt={`Ảnh ${index}`}
                        height={400}
                        className='me-2'
                        onClick={() => openImageViewer(index)}
                        style={{cursor: 'pointer'}}
                    />
                ))}
            </div>
            <h2>{plastic.namePlasticItem}</h2>

            <div className='d-flex align-items-center'>
                <p className='me-5'>
                    Thể loại:{" "}
                    <strong>
                        {plastic.genresList?.map((genre, index) => (
                            <span key={index}>{genre.nameGenre} </span>
                        ))}
                    </strong>
                </p>
                <p className='ms-5'>
                    Nhà sản xuất: <strong>{plastic.manufacturer}</strong>
                </p>
            </div>

            <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center'>
                    <Rating value={plastic.avgRating || 0} precision={0.5} readOnly size="small"/>
                    <p className='text-danger ms-2 mb-0'>({plastic.avgRating})</p>
                </div>
                <div className='d-flex align-items-center'>
                    <span className='mx-3 mb-1 text-secondary'>|</span>
                </div>
                <div className='d-flex align-items-end justify-content-center '>
                    <span style={{color: "rgb(135,135,135)", fontSize: "16px"}}>
                        Đã bán
                    </span>
                    <span className='fw-bold ms-2'>{plastic.soldQuantity}</span>
                </div>
            </div>

            <div className='price'>
                <span className='discounted-price text-danger me-3'>
                    <strong style={{fontSize: "32px"}}>
                        {plastic.sellPrice?.toLocaleString()}đ
                    </strong>
                </span>
                <span className='original-price small me-3'>
                    <strong>
                        <del>{plastic.listPrice?.toLocaleString()}đ</del>
                    </strong>
                </span>
                <h4 className='my-0 d-inline-block'>
                    <span className='badge bg-danger'>{plastic.discountPercent}%</span>
                </h4>
            </div>

            <div className='mt-3'>
                <p>
                    Vận chuyển tới: <strong>Thành phố Hà Nội</strong>{" "}
                    <span className='ms-3 text-primary' style={{cursor: "pointer"}}>
                        Thay đổi
                    </span>
                </p>
                <div className='d-flex align-items-center mt-3'>
                    <img
                        src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png'
                        height='20'
                        alt='free ship'
                    />
                    <span className='ms-3'>Miễn phí vận chuyển</span>
                </div>
            </div>

            <div className='d-flex align-items-center mt-3'>
                <strong className='me-5'>Số lượng: </strong>
                <span className='ms-4'>{plastic.quantity} sản phẩm có sẵn</span>
            </div>


        </div>
    );
};

export default ChiTietSanpham;
