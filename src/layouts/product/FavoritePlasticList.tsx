/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {endpointBE, endpointFE} from "../utils/Constant";
import { getIdUserByToken } from "../utils/JwtService";

import { Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import PlasticModels from "../../models/PlasticModels";
import {getPlasticById} from "../../api/PlasticApi";
import PlasticProps from "./componetns/PlasticProps";


interface FavoritePlasticsListProps {}

const FavoritePlasticsList: React.FC<FavoritePlasticsListProps> = (props) => {
    const [bookList, setBookList] = useState<PlasticModels[]>([]);
    const [loading, setLoading] = useState(true);
    const [reloadComponent] = useState(0);

    useEffect(() => {
        fetch(
            endpointFE + `/favorite-plastic/get-favorite-plastic/${getIdUserByToken()}`
        )
            .then((response) => response.json())
            .then((idPlaticList) => {
                const fetchBookPromises = idPlaticList.map(async (idPlastic: any) => {
                    const response = await getPlasticById(idPlastic);
                    return response;
                });

                // Sử dụng Promise.all để đợi tất cả các yêu cầu fetch hoàn thành
                return Promise.all(fetchBookPromises);
            })
            .then((books) => {
                // Xử lý danh sách sách ở đây (mảng 'books')
                setBookList(books);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }, []);

    if (loading) {
        return (
            <div className='container-book container mb-5 py-5 px-5 bg-light'>
                <div className='row'>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                    <div className='col-md-6 col-lg-3 mt-3'>
                        <Skeleton
                            className='my-3'
                            variant='rectangular'
                            height={400}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='container-book container mb-5 pb-5 px-5 bg-light'>
            <h2 className='mt-4 px-3 py-3 mb-0'>SẢN PHẨM YÊU THÍCH </h2>
            <hr className='mt-0' />
            <div className='row' key={reloadComponent}>
                {bookList.length > 0 ? (
                    bookList.map((doNhua) => (
                        <PlasticProps key={doNhua.idPlasticItem} plastic={doNhua}  />
                    ))
                ) : (
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <h4 className='text-center'>
                            Bạn chưa yêu thích quyển sách nào
                        </h4>
                        <Link to={"/search"}>
                            <Button variant='contained' className='mt-3'>
                                Kho sách
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritePlasticsList;
