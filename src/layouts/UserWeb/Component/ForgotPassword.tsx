import React, {FormEvent, useEffect, useState} from "react";
import useScrollToTop from "../../../hooks/ScrollToTop";
import {useAuth} from "../../utils/AuthContext";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {endpointBE, endpointFE} from "../../utils/Constant";
import {TextField} from "@mui/material";


export const ForgotPassword: React.FC = () => {
    useScrollToTop();

    const {isLoggedIn} = useAuth();
    const navigation = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            navigation("/");
        }
    }, []);

    const [email, setEmail] = useState("");
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        toast.promise(
            fetch(endpointFE + "/taikhoan/forgot-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email }),
            })
                .then((response) => {
                    if (response.ok) {
                        toast.success(
                            "Gửi thành công, hãy kiểm tra email để lấy mật khẩu"
                        );
                        setEmail("");
                        navigation("/dangnhap");
                    } else {
                        toast.warning("Email không tồn tại!");
                    }
                })
                .catch((error) => {
                    toast.error("Gửi thất bại");
                    console.log(error);
                }),
            { pending: "Đang trong quá trình xử lý ..." }
        );
    }

    return (
        <div
            className='container my-5 py-4 rounded-5 shadow-5 bg-light'
            style={{ width: "450px" }}
        >
            <h1 className='text-center'>QUÊN MẬT KHẨU</h1>
            <form
                onSubmit={handleSubmit}
                className='form'
                style={{ padding: "0 20px" }}
            >
                <TextField
                    fullWidth
                    required={true}
                    id='outlined-required'
                    label='Email'
                    placeholder='Nhập email'
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    className='input-field'
                />
                <div className='text-center my-3'>
                    <Button
                        fullWidth
                        variant='outlined'
                        type='submit'
                        sx={{ padding: "10px" }}
                    >
                        Lấy lại mật khẩu
                    </Button>
                </div>
            </form>
        </div>
    );
}
