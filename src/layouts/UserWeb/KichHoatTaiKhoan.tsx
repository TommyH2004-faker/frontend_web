import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function KichHoatTaiKhoan() {
    // Lấy email và activationCode từ path parameters
    const { email, activationCode } = useParams();
    const [daKichHoat, setDaKichHoat] = useState(false);
    const [thongBao, setThongBao] = useState("");

    useEffect(() => {
        if (email && activationCode) {
            thucHienKichHoat(email, activationCode);
        }
    }, [email, activationCode]);

    const thucHienKichHoat = async (email:string, activationCode:string) => {
        try {
            const url = `http://localhost:8080/taikhoan/active-account?email=${email}&activationCode=${activationCode}`;
            const response = await fetch(url, { method: "GET" });
            if (response.ok) {
                setDaKichHoat(true);
                setThongBao("Kích hoạt tài khoản thành công!");
            } else {
                const errorMessage = await response.text();
                // Nếu thông báo lỗi chứa "Tài khoản đã được kích hoạt", coi như thành công
                if (errorMessage.includes("Tài khoản đã được kích hoạt")) {
                    setDaKichHoat(true);
                    setThongBao("Tài khoản đã được kích hoạt trước đó, bạn hãy đăng nhập!");
                } else {
                    setThongBao("Kích hoạt tài khoản không thành công: " + errorMessage);
                    setDaKichHoat(false);
                }
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            setThongBao("Tài khoản không thể kích hoạt do lỗi hệ thống, vui lòng thử lại sau.");
        }
    };
    return (
        <div>
            <h1>Kích hoạt tài khoản</h1>
            { daKichHoat
                ? (<p>Tài khoản đã kích hoạt thành công, bạn hãy đăng nhập để tiếp tục sử dụng dịch vụ!</p>)
                : (<p>Không thể kích hoạt tài khoản: {thongBao}</p>)
            }
        </div>
    );
}

export default KichHoatTaiKhoan;