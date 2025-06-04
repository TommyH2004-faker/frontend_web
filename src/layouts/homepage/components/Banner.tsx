import React from 'react';
function Banner() {
    return (
        <div className="p-2 mb-2 bg-dark">
            <div className="container-fluid py-5 text-white d-flex
                justify-content-center align-items-center" >
                <div>
                    <h3 className="display-5 fw-bold">
                        Tiện nghi từng góc nhỏ <br/> Đồ nhựa chất như vỏ!
                    </h3>
                    <p className="">-Trần Minh Hiệp-</p>
                    <button className="btn btn-primary btn-lg text-white float-end">Khám phá  tại đây !</button>
                </div>

            </div>
        </div>
    );
}
export default Banner;