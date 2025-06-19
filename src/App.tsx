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
import About from "./layouts/About/About";
import {ConfirmProvider} from "material-ui-confirm";
import ProfilePage from "./page/ProfilePage";
import {Error403Page} from "./page/components/403Page";
import {Slidebar} from "./layouts/Admin/component/Slidebar";
import DashboardPage from "./layouts/Admin/Dashboard";
import PlasticManagement from "./layouts/Admin/PlasticManagement";
import UserManagementPage from "./layouts/Admin/UserManagement";
import GenreManagementPage from "./layouts/Admin/GenreManagement";
import OrderManagementPage from "./layouts/Admin/OrderManagement";
import FeedbackPage from "./layouts/Admin/FeedbackManagement";
import {Error404Page} from "./page/components/404Page";


import {CheckoutSuccess} from "./page/components/CheckoutSuccess";

const MyRoutes = () => {
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
    const [reloadAvatar, setReloadAvatar] = useState(0);
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");

    return (
        <AuthProvider>
            <CartItemProvider>
                <ConfirmProvider>
                    {/* Hiển thị Navbar và Footer cho trang khách hàng */}
                    {!isAdminPath && (
                        <>
                            <Navbar
                                key={reloadAvatar}
                                tuKhoaTimKiem={tuKhoaTimKiem}
                                setTuKhoaTimKiem={setTuKhoaTimKiem}
                            />
                            
                        </>
                    )}
                    {/* Customer Routes */}
                    {!isAdminPath && (
                        <Routes>
                            <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                            <Route path='/:idGenre' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                            <Route path='/about' element={<About/>} />
                            <Route path='/dangky' element={<DangKyNguoiDung />} />
                            <Route path='/active-account/:email/:activationCode' element={<KichHoatTaiKhoan />} />
                            <Route path='plastic-items/:idPlastic' element={<ChiTietNhua />} />
                            <Route path='/search/:idGenreParam' element={<FilterPage />} />
                            <Route path='/search' element={<FilterPage />} />
                            <Route path='/my-favorite-books' element={<FavoriteBooksList />} />
                            <Route path='/dangnhap' element={<DangNhap />} />
                            <Route path='/policy' element={<ChinhSach />} />
                            <Route path='/cart' element={<CartPage />} />
                            <Route path='/feedback' element={<FeedbackCustomerPage />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />
                            <Route path='/profile' element={<ProfilePage setReloadAvatar={setReloadAvatar} />} />
                            <Route path='/check-out/status' element={<CheckoutSuccess />} />
                            {/* Nếu không tìm thấy trang */}
                            <Route path='*' element={<Error403Page />} />
                        </Routes>
                    )}

                    {/* Hiển thị Footer cho trang khách hàng */}
                    {!isAdminPath && <Footer />}

                    {/* Admin Routes */}
                    {isAdminPath && (
                        <div className='row overflow-hidden w-100'>
                            <div className='col-2 col-md-3 col-lg-2'>
                                <Slidebar/>
                            </div>
                            <div className='col-10 col-md-9 col-lg-10'>
                                <Routes>
                                    <Route path='/admin/dashboard' element={<DashboardPage/>}/>
                                    <Route path='/admin/book' element={<PlasticManagement/>}/>
                                    <Route path='/admin/user' element={<UserManagementPage/>}/>
                                    <Route path='/admin/genre' element={<GenreManagementPage/>}/>
                                    <Route path='/admin/order' element={<OrderManagementPage/>}/>
                                    <Route path='/admin/feedback' element={<FeedbackPage/>}/>

                                    {/* Bắt lỗi 404 cho trang Admin */}
                                    <Route path='/admin/*' element={<Error404Page/>}/>
                                </Routes>
                            </div>
                        </div>
                    )}

                    {/* Toast thông báo */}
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
