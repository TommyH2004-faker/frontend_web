import React, { useState } from 'react';
import {NavLink} from "react-router-dom";

interface NavbarProps {
    tuKhoaTimKiem: string;
    setTuKhoaTimKiem: (value: string) => void;
}

function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem }: NavbarProps) {
    const [tuKhoaTam, setTuKhoaTam] = useState('');
    const [error, setError] = useState<null | string>(null);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src="/././images/Plastics/Logo.png" alt="Nhựa MH" style={{height: '40px'}}/>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
                        style={{"--bs-scroll-height": "100px"} as React.CSSProperties}>
                        <li className="nav-item">
                            <NavLink className="nav-link active" aria-current="page" to="/">Trang Chủ</NavLink>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                Link
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Link</a>
                        </li>
                    </ul>
                    <form className="d-flex" role="search" onSubmit={(e) => {
                        e.preventDefault();
                        setTuKhoaTimKiem(tuKhoaTam);
                    }}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={tuKhoaTam}
                            onChange={(e) => setTuKhoaTam(e.target.value)}
                        />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
