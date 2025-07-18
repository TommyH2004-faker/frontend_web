import React from "react";

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-brand">
                    <img src={process.env.PUBLIC_URL + '/images/Plastics/Logo.png'} alt="Logo" className="footer-logo" />
                    <p className="footer-slogan">Nâng tầm cuộc sống với nhựa chất lượng!</p>
                </div>
                <div className="footer-columns">
                    <div className="footer-col">
                        <h4>Về chúng tôi</h4>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Sản phẩm</a></li>
                            <li><a href="#">Tin tức</a></li>
                            <li><a href="#">Liên hệ</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Hỗ trợ khách hàng</h4>
                        <ul>
                            <li><a href="#">Chính sách bảo hành</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Hướng dẫn mua hàng</a></li>
                            <li><a href="#">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Kết nối</h4>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="Youtube"><i className="fab fa-youtube"></i></a>
                        </div>
                        <div className="footer-contact">
                            <p><i className="fas fa-phone-alt"></i> 0123 456 789</p>
                            <p><i className="fas fa-envelope"></i> info@plasticshop.vn</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Plastic Shop. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;