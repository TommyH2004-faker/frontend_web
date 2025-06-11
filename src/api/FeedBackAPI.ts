import { my_request, requestAdmin } from './Request';
import FeedbackModel from "../models/FeedbackModel";
import ReviewModel from "../models/ReviewModel";
import { endpointBE } from "../layouts/utils/Constant";

// getTotalNumberOfFeedbacks
export async function getTotalNumberOfFeedbacks(): Promise<number> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/feedback/totalFeedbacks`;
    // Gọi phương thức request
    const response = await my_request(duongDan);
    return response;
}

// getAllFeedbacks
export async function getAllFeedback(): Promise<FeedbackModel[]> {
    const endpoint = endpointBE + "/feedback/feedbacks?sort=idFeedback,desc";
    const response = await requestAdmin(endpoint);

    let feedbacks: FeedbackModel[] = [];

    // Kiểm tra nếu có dữ liệu trả về
    if (response && response.length > 0) {
        feedbacks = response.map((feedbackData: any) => {
            return {
                idFeedback: feedbackData.idFeedback,
                title: feedbackData.title,
                comment: feedbackData.comment,
                dateCreated: feedbackData.dateCreated,
                isReaded: feedbackData.isReaded,
                idUser: feedbackData.idUser,
                user: feedbackData.user ? {
                    idUser: feedbackData.user.idUser,
                    firstName: feedbackData.user.firstName,
                    lastName: feedbackData.user.lastName,
                    username: feedbackData.user.username,
                    email: feedbackData.user.email,
                    phoneNumber: feedbackData.user.phoneNumber,
                    avatar: feedbackData.user.avatar,
                    gender: feedbackData.user.gender
                } : null // Nếu không có dữ liệu user, gán null
            };
        });
    }

    return feedbacks;
}

// Lay danh gia mot sach
async function layDanhGiaCuaMotSach(duongDan: string): Promise<ReviewModel[]> {
    const ketQua: ReviewModel[] = [];

    // Gọi phương thức request
    const response = await my_request(duongDan);

    // Lấy ra json sách
    const responseData = response._embedded.reviews;

    for (const key in responseData) {
        ketQua.push({
            idReview: responseData[key].idReview,
            content: responseData[key].content,
            ratingPoint: responseData[key].ratingPoint,
            timestamp: responseData[key].timestamp
        });
    }

    return ketQua;
}

// Lay toan bo danh gia cua mot sach
export async function layToanBoDanhGiaCuaMotPlastic(maNhua: number): Promise<ReviewModel[]> {
    const duongDan: string = `http://localhost:8080/plastic-items/${maNhua}/listReviews`;
    return layDanhGiaCuaMotSach(duongDan);
}

// Lay 1 danh gia cua mot sach
export async function lay1DanhGiaCuaMotPlastic(maNhua: number): Promise<ReviewModel[]> {
    const duongDan: string = `http://localhost:8080/plastic-items/${maNhua}/listReviews?sort=idReview,asc&page=0&size=1`;
    return layDanhGiaCuaMotSach(duongDan);
}
