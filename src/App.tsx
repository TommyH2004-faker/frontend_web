import React, { useState } from 'react';
import './App.css';
import HomePage from "./layouts/homepage/HomePage";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import Navbar from "./layouts/header-footer/Navbar";
import Footer from "./layouts/header-footer/Footer";
import {AuthProvider} from "./layouts/utils/AuthContext";
import {CartItemProvider} from "./models/CartItemContext";
import FilterPage from "./page/FilterPage";
import DangNhap from "./layouts/UserWeb/DangNhap";
import DangKyNguoiDung from "./layouts/UserWeb/DangKyNguoiDung";
import {ToastContainer} from "react-toastify";
import KichHoatTaiKhoan from "./layouts/UserWeb/KichHoatTaiKhoan";
import {ForgotPassword} from "./layouts/UserWeb/Component/ForgotPassword";
import ChiTietNhua from "./layouts/product/ChiTietNhua";
import CartPage from "./page/CartPage";
import {FeedbackCustomerPage} from "./page/components/FeedbackCustomerPage";
import ChinhSach from "./page/ChinhSach";
import FavoriteBooksList from "./layouts/product/FavoritePlasticList";
import FavoritePlasticsList from "./layouts/product/FavoritePlasticList";
import About from "./layouts/About/About";
import {ConfirmProvider} from "material-ui-confirm";
import ProfilePage from "./page/ProfilePage";

const MyRoutes = () => {
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
    const [reloadAvatar, setReloadAvatar] = useState(0);
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");
    return (
        <AuthProvider>
            <CartItemProvider>  {/* Thêm CartItemProvider ở đây */}
                <ConfirmProvider>
                <>
                    <Navbar tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoaTimKiem} />

                    <Routes>
                        <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                        <Route path='/plastic-items/:idPlastic' element={<ChiTietNhua />} />
                        <Route path='/genre/:idGenreParam' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                        <Route path='/search/:idGenreParam' element={<FilterPage />} />
                        <Route path='/search' element={<FilterPage />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/dangnhap' element={<DangNhap/>} />
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route path='/dangky' element={<DangKyNguoiDung />} />
                        <Route path='/cart' element={<CartPage />} />
                        <Route path='/active-account/:email/:activationCode' element={<KichHoatTaiKhoan />} />
                        <Route path='/feedback' element={<FeedbackCustomerPage/>} />
                        <Route path='policy' element={<ChinhSach />} />
                        <Route path='my-favorite-books' element={<FavoritePlasticsList/>}/>
                        <Route path='/profile' element={<ProfilePage setReloadAvatar={setReloadAvatar} />} />
                    </Routes>

                    <Footer />
                </>
                <ToastContainer position='bottom-center' autoClose={3000} pauseOnFocusLoss={false} />
                </ConfirmProvider>
            </CartItemProvider>
        </AuthProvider>
    );
};

function App() {
    return (
        <BrowserRouter>
            <MyRoutes />
        </BrowserRouter>
    );
}

export default App;
