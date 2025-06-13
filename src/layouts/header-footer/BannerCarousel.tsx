import React from "react";

interface BannerCarouselProps {
    images: string[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ images }) => {
    return (
        <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                {images.map((src, index) => (
                    <div
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        key={index}
                    >
                        <img
                            src={src}
                            className="d-block w-100"
                            alt={`Banner ${index + 1}`}
                            style={{ objectFit: "cover", height: "400px" }}
                        />
                    </div>
                ))}
            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" />
                <span className="visually-hidden">Previous</span>
            </button>

            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" />
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default BannerCarousel;
