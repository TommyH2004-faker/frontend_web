import React, {useEffect, useState} from "react";
import PlasticModels from "../../models/PlasticModels";
import {getAllPlasticItems, layToanBoDoNhua, searchPlasticItems} from "../../api/PlasticApi";
import {Button, Skeleton} from "@mui/material";
import PlasticProps from "./componetns/PlasticProps";
import {Link} from "react-router-dom";
import {PhanTrang} from "../utils/PhanTrang";
interface PlasticListProps {
    paginable?: boolean;
    keySearch?: string;
    size: number;
    idGenre?: number;
    filter?: number;
}
const PlasticList: React.FC<PlasticListProps> = (props) => {
   const [PlasticList, setPlasticList] = useState<PlasticModels[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erroring, setErroring] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Xu lý phân trang
    const handlePagination = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    }
    // Chỗ này xử lý khi thực hiện chức năng hiện số sản phẩm
    const [totalPagesTemp, setTotalPagesTemp] = useState(totalPages);
    useEffect(() => {
        // Reset về trang 1 khi bộ lọc thay đổi
        setCurrentPage(1);
    }, [props.keySearch, props.idGenre, props.filter, props.size]);

   /* useEffect(() => {
        setLoading(true);
        console.log("🔍 Debug:");
        console.log("keySearch:", props.keySearch);
        console.log("trimmed keySearch:", props.keySearch?.trim());
        console.log("idGenre:", props.idGenre);
        console.log("filter:", props.filter);


        const searchText = props.keySearch?.trim() ?? "";
        const genre = props.idGenre ?? 0;
        const sort = props.filter ?? 0;

        const isEmptySearch = searchText === "";
        const isDefaultGenre = genre === 0;
        const isDefaultSort = sort === 0;
        console.log("isEmptySearch:", searchText);
        console.log("isDefaultGenre:", genre);
        console.log("isDefaultSort:", sort);
        if (isEmptySearch && isDefaultGenre && isDefaultSort) {
            // GỌI API LẤY TẤT CẢ
            getAllPlasticItems(props.size, currentPage - 1)
                .then(response => {
                    setPlasticList(response.ketQua);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch(error => {
                    setErroring(error.message);
                    setLoading(false);
                });
        } else {
            // GỌI API TÌM KIẾM / LỌC
            searchPlasticItems(genre, searchText, sort, currentPage - 1, props.size)
                .then(response => {
                    setPlasticList(response.ketQua);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch(error => {
                    setErroring(error.message);
                    setLoading(false);
                });
        }
    }, [currentPage, props.keySearch, props.idGenre, props.filter, props.size]);*/
    useEffect(() => {
        setLoading(true);

        const searchText = props.keySearch?.trim() ?? "";
        const genre = Number(props.idGenre ?? 0);
        const sort = Number(props.filter ?? 0);

        const isEmptySearch = searchText === "";
        const isDefaultGenre = genre === 0;
        const isDefaultSort = sort === 0;

        console.log("🔍 Debug:");
        console.log("keySearch:", props.keySearch);
        console.log("trimmed keySearch:", searchText);
        console.log("idGenre:", genre);
        console.log("filter:", sort);
        console.log("isEmptySearch:", isEmptySearch);
        console.log("isDefaultGenre:", isDefaultGenre);
        console.log("isDefaultSort:", isDefaultSort);

        if (isEmptySearch && isDefaultGenre && isDefaultSort) {
            layToanBoDoNhua(currentPage - 1)
                .then(response => {
                    setPlasticList(response.ketQua);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch(error => {
                    setErroring(error.message);
                    setLoading(false);
                });
        } else {
            searchPlasticItems(genre, searchText, sort, currentPage - 1, props.size)
                .then(response => {
                    setPlasticList(response.ketQua);
                    setTotalPages(response.tongSoTrang);
                    setLoading(false);
                })
                .catch(error => {
                    setErroring(error.message);
                    setLoading(false);
                });
        }
    }, [currentPage, props.keySearch, props.idGenre, props.filter, props.size]);


    if(loading) {
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
if (erroring) {
    return (
        <div>
            <h1>Error: {erroring}</h1>
        </div>
    );
}
if (PlasticList.length === 0) {
    return (
        <div className='container-book container mb-5 px-5 px-5 bg-light'>
            <h2 className='mt-4 px-3 py-3 mb-0'>
                Không tìm thấy sản phẩm (plastic)theo yêu cầu! "{props.keySearch}"
            </h2>
        </div>
    );
}
    return (
        <div className='container-book container mb-5 pb-5 px-5 bg-light'>
            {!props.paginable && (
                <>
                    <h2 className='mt-4 px-3 py-3 mb-0'>TẤT CẢ</h2>
                    <hr className='mt-0' />
                </>
            )}
            <div className='row'>
                {PlasticList.map((PlasticItem) => (
                    <PlasticProps  plastic={PlasticItem} key={PlasticItem.idPlasticItem} />
                ))}
            </div>
            {props.paginable ? (
                <>
                    <hr className='mt-5' style={{ color: "#aaa" }} />
                    <PhanTrang trangHienTai={currentPage} tongSoTrang={totalPages} phanTrang={handlePagination} />
                </>
            ) : (
                <Link to={"/search"}>
                    <div className='d-flex align-items-center justify-content-center'>
                        <Button
                            variant='outlined'
                            size='large'
                            className='text-primary mt-5 w-25'
                        >
                            Xem Thêm
                        </Button>
                    </div>
                </Link>
            )}
        </div>
    );
};
export default PlasticList;