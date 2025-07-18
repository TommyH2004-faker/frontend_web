import { my_request, requestAdmin } from './Request';
import FeedbackModel from "../models/FeedbackModel";
import ReviewModel from "../models/ReviewModel";
import {endpointBE, endpointFE} from "../layouts/utils/Constant";

// getTotalNumberOfFeedbacks
export async function getTotalNumberOfFeedbacks(): Promise<number> {
    // Xác định endpoint
    const duongDan: string = endpointFE +`feedback/totalFeedbacks`;
    // Gọi phương thức request
    const response = await my_request(duongDan);
    return response;
}
async function fetchUserName(userLink: string): Promise<string> {
    try {
        const response = await fetch(userLink);
        if (!response.ok) throw new Error("User fetch failed");
        const userData = await response.json();
        return `${userData.lastName} ${userData.firstName}`;
    } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        return "Ẩn danh";
    }
}
// getAllFeedbacks
/*export async function getAllFeedback(): Promise<FeedbackModel[]> {
    const endpoint = endpointBE + "/feedbacks?sort=idFeedback,desc";


    const response = await requestAdmin(endpoint);

    let feedbacks: FeedbackModel[] = [];

    if (response) {
        feedbacks = await response._embedded.feedbackses.map((feedbackData: any) => ({
            ...feedbackData
        }))
    }

    return feedbacks;
}*/
export async function getAllFeedback(): Promise<FeedbackModel[]> {
    const endpoint = `${endpointFE}/feedbacks?sort=idFeedback,desc`;
    const response = await requestAdmin(endpoint);

    let feedbacks: FeedbackModel[] = [];

    if (response && response._embedded && response._embedded.feedbackses) {
        const feedbackRawList = response._embedded.feedbackses;

        feedbacks = await Promise.all(
            feedbackRawList.map(async (feedbackData: any) => {
                const fullName = await fetchUserName(feedbackData._links.user.href);
                return {
                    ...feedbackData,
                    id: feedbackData.idFeedback,
                    user: fullName // 👈 Thêm tên người dùng vào đây
                };
            })
        );
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
    const duongDan: string = endpointFE+`plastic-items/${maNhua}/listReviews`;
    return layDanhGiaCuaMotSach(duongDan);
}

// Lay 1 danh gia cua mot sach
export async function lay1DanhGiaCuaMotPlastic(maNhua: number): Promise<ReviewModel[]> {
    const duongDan: string = endpointFE+`plastic-items/${maNhua}/listReviews?sort=idReview,asc&page=0&size=1`;
    return layDanhGiaCuaMotSach(duongDan);
}
