import React, { useEffect, useState } from "react";
import ImageModel from "../../../models/ImageModel";
import {layToanBoHinhAnhMotNhua} from "../../../api/ImageApi";

interface Props {
    idPlastic: number;
}

const BookImageCarousel: React.FC<Props> = ({ idPlastic }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        layToanBoHinhAnhMotNhua(idPlastic)
            .then((data) => {
                setImages(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, [idPlastic]);

    if (loading) return <div>Đang tải ảnh...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    if (images.length === 0) return <div>Không có ảnh</div>;

    return (
        <div className="text-center">
            {/* Ảnh chính */}
            <div className="mb-3">
                <img
                    src={images[currentIndex].urlImage}
                    alt="Ảnh sách"
                    style={{ width: "350px", height: "auto", objectFit: "contain" }}
                />
            </div>

            {/* Thumbnails */}
            <div className="d-flex justify-content-center gap-2 flex-wrap">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.urlImage}
                        onClick={() => setCurrentIndex(index)}
                        alt={`thumb-${index}`}
                        style={{
                            width: "60px",
                            height: "60px",
                            border: index === currentIndex ? "2px solid #007bff" : "1px solid #ccc",
                            borderRadius: "5px",
                            cursor: "pointer",
                            objectFit: "cover",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookImageCarousel;
