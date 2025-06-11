import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";

function About() {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
    return (
        <div className='w-100 h-100 d-flex align-items-center justify-content-center flex-column m-5'>
            <div className='w-50 h-50 p-3 rounded-5 shadow-4-strong bg-light'>
                <h3 className='text-center text-black'>Giới thiệu về Cửa hàng Nhựa Minh Hiệp</h3>
                <hr />
                <div className='row'>
                    <div className='col-lg-8'>
                        <p>
                            <strong>Tên cửa hàng: </strong>Nhựa Minh Hiệp
                        </p>
                        <p>
                            <strong>Địa chỉ: </strong>Xã Yên Bình, Huyện Vĩnh Tường, Tỉnh Vĩnh Phúc
                        </p>
                        <p>
                            <strong>Số điện thoại: </strong>0813 535 314
                        </p>
                        <p>
                            <strong>Email: </strong>hiept81331@gmail.com
                        </p>
                        <p>
                            <strong>Giới thiệu: </strong>Chuyên cung cấp các sản phẩm nhựa gia dụng chất lượng, đa dạng mẫu mã, giá cả hợp lý phục vụ nhu cầu sinh hoạt hằng ngày của mọi gia đình.
                        </p>
                    </div>
                    <div className='col-lg-4'>
                        <div
                            className='d-flex align-items-center justify-content-center rounded-5'
                            style={{ border: "1px solid #ccc" }}
                        >
                            <img
                                src={"/images/Plastics/Logo.png"}
                                width='150'
                                alt='Logo Nhựa Minh Hiệp'
                                loading='lazy'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-50 h-50 p-3 rounded-5 shadow-4-strong bg-light mt-3'>
                <h3 className='text-center text-black'>Bản đồ Google Maps</h3>
                <hr />
                <div className='d-flex align-items-center justify-content-center'>
                    <iframe
                        title='Google Map '
                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8014332370055!2d105.82014037487726!3d21.001670388653423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7bdc1c21ef%3A0xa9b7eb888df4bb03!2zSMOgIE7hu5lpLCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1718000000000!5m2!1svi!2s'
                        width='600'
                        height='450'
                        style={{border: 0}}
                        allowFullScreen={true}
                        loading='lazy'
                        referrerPolicy='no-referrer-when-downgrade'
                    ></iframe>

                </div>
            </div>
        </div>
    );
}

export default About;
