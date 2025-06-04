import React, { useState } from 'react';
import './App.css';
import HomePage from "./layouts/homepage/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./layouts/header-footer/Navbar";
import ChiTietSanPham from "./layouts/product/ChiTietSanPham";
import Footer from "./layouts/header-footer/Footer";

const MyRoutes = () => {
    const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

    return (
        <>
            {/* Navbar luôn hiển thị, nằm ngoài Routes */}
            <Navbar tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoaTimKiem} />

            <Routes>
                <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
                <Route path='/plastic-items/:idPlastic' element={<ChiTietSanPham />} />
            </Routes>

            {/* Footer */}
            <Footer />
        </>
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
