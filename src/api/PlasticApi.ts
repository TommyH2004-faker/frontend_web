import PlasticModels from "../models/PlasticModels";
import {my_request} from "./Request";
import {endpointBE} from "../layouts/utils/Constant";

interface KetQuaInterFace{
    ketQua:PlasticModels[];
    tongSoTrang: number;
    tongSoDoNhua: number;
}
async function  layDanhSachDoNhua(duongDan:string):Promise<KetQuaInterFace> {

    const ketQua:PlasticModels[] = [];

    const respone = await my_request(duongDan);
    const responseData = respone._embedded.plasticItems;
    const tongSoTrang = respone.page.totalPages;
    const tongSoDoNhua = respone.page.totalElements;
    for(const item in responseData){
        ketQua.push({
            idPlasticItem: responseData[item].idPlasticItem,
            namePlasticItem: responseData[item].namePlasticItem,
            manufacturer: responseData[item].manufacturer,
            description: responseData[item].description,
            listPrice: responseData[item].listPrice,
            sellPrice: responseData[item].sellPrice,
            quantity: responseData[item].quantity,
            avgRating: responseData[item].avgRating,
            soldQuantity: responseData[item].soldQuantity,
            discountPercent: responseData[item].discountPercent,
            thumbnail: responseData[item].thumbnail,

        });
    }
    return {ketQua: ketQua, tongSoTrang: tongSoTrang, tongSoDoNhua: tongSoDoNhua};

}
export async function getAllPlasticItems(page: number, size: number): Promise<KetQuaInterFace> {
    const duongDan = `http://localhost:8080/plastic-items?sort=idPlasticItem,desc&page=${page}&size=${size}`;
    return layDanhSachDoNhua(duongDan);

}
export async function layToanBoDoNhua(trangHienTai:number): Promise<KetQuaInterFace> {
    const duongDan = `http://localhost:8080/plastic-items?sort=idPlasticItem,,desc&size=8&page=${trangHienTai}`;
    return layDanhSachDoNhua(duongDan);
}
export async function  timKiemPlastic(tuKhoaTimKiem:string,idGenre:number): Promise<KetQuaInterFace> {
    let duongDan = "http://localhost:8080/plastic-items?sort=idPlasticItem,,desc&size=8&page=0";
    if(tuKhoaTimKiem!== '' && idGenre ==0){
        duongDan = `http://localhost:8080/plastic-items/search/findByNamePlasticItemContaining?namePlastic=${tuKhoaTimKiem}`;
    }
    else if(tuKhoaTimKiem === '' && idGenre > 0){
        duongDan = `http://localhost:8080/plastic-items/search/findByListGenres_idGenre?idGenre=${idGenre}`;
    }else if(tuKhoaTimKiem !== '' && idGenre > 0){
        duongDan = `http://localhost:8080/plastic-items/search/findByNamePlasticItemContainingAndListGenres_idGenre?namePlastic=${tuKhoaTimKiem}&idGenre=${idGenre}`;
    }
    return layDanhSachDoNhua(duongDan);
}
export async function searchPlasticItems(idGenre?:number,keySearch?: string,filter?:number, page?: number, size?: number): Promise<KetQuaInterFace> {
    // Xử lý keySearch
    if (keySearch) {
        keySearch = keySearch.trim();
    }

    const optionsShow = `size=${size}&page=${page}`;

    // Endpoint mặc định
    let endpoint: string = endpointBE + `/plastic-items?` + optionsShow;

    let filterEndpoint = '';
    if (filter === 1) {
        filterEndpoint = "sort=namePlasticItem";
    } else if (filter === 2) {
        filterEndpoint = "sort=namePlasticItem,desc";
    } else if (filter === 3) {
        filterEndpoint = "sort=sellPrice";
    } else if (filter === 4) {
        filterEndpoint = "sort=sellPrice,desc";
    } else if (filter === 5) {
        filterEndpoint = "sort=soldQuantity,desc";
    }

    // Nếu có key search và không có lọc thể loại
    if (keySearch !== '') {
        // Mặc đinh nếu không có filter

        endpoint = endpointBE + `/plastic-items/search/findByNamePlasticItemContaining?namePlastic=${keySearch}&` + optionsShow + '&' + filterEndpoint;
    }

    // Nếu idGenre không undifined
    if (idGenre !== undefined) {
        // Nếu có không có key search và có lọc thể loại
        if (keySearch === '' && idGenre > 0) {
            // Mặc định nếu không có filter
            endpoint = endpointBE + `/plastic-items/search/findByListGenres_idGenre?idGenre=${idGenre}&` + optionsShow + '&' + filterEndpoint;
        }

        // Nếu có key search và có lọc thể loại
        if (keySearch !== '' && idGenre > 0) {
            endpoint = endpointBE + `/plastic-items/search/findByNamePlasticItemContainingAndListGenres_idGenre?namePlastic=${keySearch}&idGenre=${idGenre}&` + optionsShow + '&' + filterEndpoint;
        }

        // Chỉ lọc filter
        if (keySearch === '' && (idGenre === 0 || typeof (idGenre) === 'string')) {
            endpoint = endpointBE + "/plastic-items?" + optionsShow + '&' + filterEndpoint;
        }

        // console.log("idGenre: " + typeof (idGenre) + idGenre + ", filter: " + typeof (filter) + filter + ", keySearch" + +typeof (keySearch) + keySearch);
    }

    // console.log(endpoint);

    return layDanhSachDoNhua(endpoint);
}
export async function get3DoNhuaMoiNhat(): Promise<KetQuaInterFace> {
    const duongDan = "http://localhost:8080/plastic-items?sort=idPlasticItem,desc&page=0&size=3";
    return layDanhSachDoNhua(duongDan);
}
export async function layPlasticbyId(idPlastic: number): Promise<PlasticModels | null> {
    const duongDan = `http://localhost:8080/plastic-items/${idPlastic}`;

    try {
        const response = await fetch(duongDan);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            throw new Error("Không tìm thấy sản phẩm nhựa với ID: " + idPlastic);
        }

        return {
            idPlasticItem: data.idPlasticItem,
            namePlasticItem: data.namePlasticItem,
            manufacturer: data.manufacturer,
            description: data.description,
            listPrice: data.listPrice,
            sellPrice: data.sellPrice,
            quantity: data.quantity,
            avgRating: data.avgRating,
            soldQuantity: data.soldQuantity,
            discountPercent: data.discountPercent,
            thumbnail: data.thumbnail
        };

    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nhựa:", error);
        return null;
    }
}