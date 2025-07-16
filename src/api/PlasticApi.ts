import PlasticModels from "../models/PlasticModels";
import {my_request, requestAdmin} from "./Request";
import {endpointBE} from "../layouts/utils/Constant";
import {layToanBoHinhAnhMotNhua} from "./ImageApi";
import plasticList from "../layouts/product/PlasticList";
import GenreModel from "../models/GenreModel";
import {getGenreById} from "./GenresApi";

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
    for (const item of responseData) {
        ketQua.push({
            idPlasticItem: item.idPlasticItem,
            namePlasticItem: item.namePlasticItem,
            manufacturer: item.manufacturer,
            description: item.description,
            listPrice: item.listPrice,
            sellPrice: item.sellPrice,
            quantity: item.quantity,
            avgRating: item.avgRating,
            soldQuantity: item.soldQuantity,
            discountPercent: item.discountPercent,
            thumbnail: item.thumbnail,
        });
    }

    return {ketQua: ketQua, tongSoTrang: tongSoTrang, tongSoDoNhua: tongSoDoNhua};

}
export async function getAllPlasticItems(page: number, size: number): Promise<KetQuaInterFace> {
    const duongDan = `http://localhost:8080/plastic-items?sort=idPlasticItem,desc&page=${page}&size=${size}`;
    return layDanhSachDoNhua(duongDan);

}
export async function layToanBoDoNhua(trangHienTai:number): Promise<KetQuaInterFace> {
    const duongDan = `http://localhost:8080/plastic-items?sort=idPlasticItem,desc&size=8&page=${trangHienTai}`;
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

export async function searchPlasticItems(idGenre?: number, keySearch?: string, filter?: number, page?: number, size?: number): Promise<KetQuaInterFace> {
    // Xử lý keySearch
    if (keySearch) {
        keySearch = keySearch.trim();
    }

    const optionsShow = `size=${size}&page=${page}`;

    // Tạo endpoint mặc định
    let endpoint: string = endpointBE + `/plastic-items?` + optionsShow;

    // Xử lý filter
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
            endpoint = endpointBE + `/plastic-items/search/findByListGenres_IdGenre?idGenre=${idGenre}&` + optionsShow + '&' + filterEndpoint;
        }

        // Nếu có key search và có lọc thể loại
        if (keySearch !== '' && idGenre > 0) {
            endpoint = endpointBE + `/plastic-items/search/findByNamePlasticItemContainingAndListGenres_IdGenre?namePlastic=${keySearch}&idGenre=${idGenre}&` + optionsShow + '&' + filterEndpoint;
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


/*export async function searchPlasticItems(
    idGenre?: number,
    keySearch?: string,
    filter?: number,
    page: number = 0,
    size: number = 12
): Promise<KetQuaInterFace> {
    // Chuẩn hóa keySearch
    const trimmedKey = keySearch?.trim() || "";
    const hasSearch = trimmedKey !== "";
    const hasGenre = idGenre !== undefined && idGenre > 0;

    // Tạo base router
    let endpoint = `${endpointBE}/plastic-items?size=${size}&page=${page}`;

    // Xác định route tìm kiếm dựa trên key và genre
    if (hasSearch && hasGenre) {
        endpoint = `${endpointBE}/plastic-items/search/findByNamePlasticItemContainingAndListGenres_IdGenre?namePlastic=${encodeURIComponent(trimmedKey)}&idGenre=${idGenre}&size=${size}&page=${page}`;
    } else if (hasSearch) {
        endpoint = `${endpointBE}/plastic-items/search/findByNamePlasticItemContaining?namePlastic=${encodeURIComponent(trimmedKey)}&size=${size}&page=${page}`;
    } else if (hasGenre) {
        endpoint = `${endpointBE}/plastic-items/search/findByListGenres_IdGenre?idGenre=${idGenre}&size=${size}&page=${page}`;
    }

    // Xử lý filter vào query param sort nếu có
    let sortParam = "";
    switch (filter) {
        case 1: sortParam = "namePlasticItem"; break;
        case 2: sortParam = "namePlasticItem,desc"; break;
        case 3: sortParam = "sellPrice"; break;
        case 4: sortParam = "sellPrice,desc"; break;
        case 5: sortParam = "soldQuantity,desc"; break;
    }
    if (sortParam) {
        // Nếu endpoint đã chứa '?', dùng '&sort=...'
        const connector = endpoint.includes("?") ? "&" : "?";
        endpoint += `${connector}sort=${sortParam}`;
    }

    // Debug URL
    console.log("searchPlasticItems endpoint:", endpoint);

    // Gọi API
    return layDanhSachDoNhua(endpoint);
}*/



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
export async function getPlasticByIdCartItem(idCart:number):Promise<PlasticModels |null >{
    const endpoint = endpointBE + `/cart-items/${idCart}/plasticItem`;
    try{
        const response = await my_request(endpoint);

        if(response){
            return response ;
        }else{
            throw new Error("Không tìm thấy sản phẩm nhựa với ID giỏ hàng: " + idCart);
        }
    }catch (error) {
        console.error("Lỗi khi lấy sản phẩm nhựa từ giỏ hàng:", error);
        return null;
    }

}

// Lấy sách theo id (chỉ lấy thumbnail)
export async function getPlasticById(idPlastic: number): Promise<PlasticModels | null> {
    let plasticRespone :PlasticModels = {
        idPlasticItem: 0,
        namePlasticItem: "",
        manufacturer: "",
        description: "",
        listPrice: NaN,
        sellPrice: NaN,
        quantity: NaN,
        avgRating: NaN,
        soldQuantity: NaN,
        discountPercent: NaN,
        thumbnail: "",
    }
    const endpoint = endpointBE + `/plastic-items/${idPlastic}`;
    try {
        // Gọi phương thức request()
        const response = await my_request(endpoint);

        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {
            plasticRespone= response;
            // Trả về quyển sách
            const responseImg = await layToanBoHinhAnhMotNhua(response.idPlasticItem);
            const thumbnail = responseImg.filter(image => image.thumbnail);
            return {
                ...plasticRespone,
                thumbnail: thumbnail[0].urlImage,
            };
        } else {
            throw new Error("Sách không tồn tại");
        }

    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}

export  async function get3BestSeller():Promise<PlasticModels[]>{
    const endpoint = endpointBE +"/plastic-items?sort=soldQuantity,desc&page=0&size=3";
    let plasticList = await layDanhSachDoNhua(endpoint);

    let newPlastic =await Promise.all(plasticList.ketQua.map(async (plastics:any)=>{
        const plasticItem = await layToanBoHinhAnhMotNhua(plastics.idPlasticItem);
        const thumbnail = plasticItem.filter(image => image.urlImage);
        return {
            ...plastics,
            thumbnail: thumbnail[0].urlImage
        };
    }));
    return newPlastic;
}
export async function getPlasticByIdAllInformation(idPlastic: number): Promise<PlasticModels | null> {
    let plasticResponse: PlasticModels = {
        idPlasticItem: 0,
        namePlasticItem: "",
        manufacturer: "",
        description: "",
        listPrice: NaN,
        sellPrice: NaN,
        quantity: NaN,
        avgRating: NaN,
        soldQuantity: NaN,
        discountPercent: NaN,
        thumbnail: "",
        relatedImg: [],
        idGenres: [],
        genresList: [],
    }

    try {
        // Gọi phương thức request()
        const response = await layPlasticbyId(idPlastic);

        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {
            // Lưu dữ liệu sách
            plasticResponse = response;

            // Lấy tất cả hình ảnh của sách
            const imagesList = await layToanBoHinhAnhMotNhua(response.idPlasticItem);
            const thumbnail = imagesList.find((image) => image.thumbnail);
            const relatedImg = imagesList.map((image) => {
                // Sử dụng conditional (ternary) để trả về giá trị
                return !image.thumbnail ? image.urlImage || image.dataImage : null;
            }).filter(Boolean); // Loại bỏ các giá trị null



            plasticResponse = { ...plasticResponse, relatedImg: relatedImg as string[], thumbnail: thumbnail?.urlImage || thumbnail?.dataImage };

            // Lấy tất cả thể loại của sách
            const genresList = await getGenreById(response.idPlasticItem);
            genresList.genreList.forEach((genre) => {
                const dataGenre: GenreModel = { idGenre: genre.idGenre, nameGenre: genre.nameGenre };
                plasticResponse = { ...plasticResponse, genresList: [...plasticResponse.genresList || [], dataGenre] };
            })

            return plasticResponse;
        } else {
            throw new Error("Sách không tồn tại");
        }

    } catch (error) {
        console.error('Error: ', error);
        return null;
    }
}
export async function getTotalOfPlastic():Promise<number>{
    const endpoint = "http://localhost:8080/plastic/get-total";
    try {
        // Gọi phương thức request()
        const response = await requestAdmin(endpoint);
        // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
        if (response) {
            // Trả về số lượng cuốn sách
            return response;
        }
    } catch (error) {
        throw new Error("Lỗi không gọi được endpoint lấy tổng cuốn sách\n" + error);
    }
    return 0;
}