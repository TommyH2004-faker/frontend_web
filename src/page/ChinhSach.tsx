import React from "react";
import useScrollToTop from "../hooks/ScrollToTop";

const ChinhSach: React.FC = () => {
    useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

    return (
        <div className='container my-5 bg-super-light p-4 rounded'>
            <h1>CHÍNH SÁCH ĐỔI / TRẢ / HOÀN TIỀN</h1>
            <p>
                Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách hàng khi trải nghiệm mua hàng tại{" "}
                <a href='#!'>
                    <strong>Cửa hàng Nhựa Minh Hiệp</strong>
                </a>
                . Do đó chúng tôi luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục vụ mọi nhu cầu mua sắm của quý khách.
            </p>
            <p>
                <a href='#!'>
                    <strong>Cửa hàng Nhựa Minh Hiệp</strong>
                </a>{" "}
                cam kết tất cả các sản phẩm bán tại{" "}
                <a href='#!'>
                    <strong>Cửa hàng Nhựa Minh Hiệp</strong>
                </a>{" "}
                100% là sản phẩm chất lượng, có nguồn gốc xuất xứ rõ ràng, hợp pháp và an toàn cho người tiêu dùng. Để việc mua sắm trở thành trải nghiệm thân thiện, quý khách vui lòng kiểm tra kỹ các nội dung sau trước khi nhận hàng:
            </p>
            <ul>
                <li>Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.</li>
                <li>Số lượng sản phẩm.</li>
            </ul>
            <p>
                Trong trường hợp sản phẩm nhận được có khiếm khuyết, hư hỏng hoặc không đúng mô tả, chúng tôi cam kết bảo vệ quyền lợi người tiêu dùng thông qua chính sách đổi trả/hoàn tiền.
            </p>
            <p>
                Quý khách vui lòng liên hệ hotline <strong>1900636467</strong> hoặc truy cập{" "}
                <a href='#!chinh-sach-doi-tra-hang'>
                    <strong>minhhiepplastic.com/chinh-sach-doi-tra-hang</strong>
                </a>{" "}
                để tìm hiểu thêm về chính sách đổi/trả.
            </p>

            <strong>1. Thời gian áp dụng đổi/trả</strong> <br />
            <table
                style={{ width: "100%" }}
                cellSpacing='1'
                cellPadding='1'
                className='table table-bordered'
            >
                <thead>
                <tr>
                    <th></th>
                    <th>KỂ TỪ KHI GIAO HÀNG THÀNH CÔNG</th>
                    <th>SẢN PHẨM LỖI (do nhà cung cấp)</th>
                    <th>SẢN PHẨM KHÔNG LỖI (*)</th>
                    <th>SẢN PHẨM LỖI DO NGƯỜI SỬ DỤNG</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td rowSpan={4}>
                        Sản phẩm điện gia dụng, đồ nhựa điện tử,...
                    </td>
                    <td rowSpan={2}>7 ngày đầu tiên</td>
                    <td>Đổi mới</td>
                    <td rowSpan={3}>Trả hàng không thu phí</td>
                    <td rowSpan={4}>Bảo hành hoặc sửa chữa có thu phí theo quy định của nhà cung cấp.</td>
                </tr>
                <tr>
                    <td>Trả không thu phí</td>
                </tr>
                <tr>
                    <td>8 - 30 ngày</td>
                    <td>Bảo hành</td>
                </tr>
                <tr>
                    <td>30 ngày trở đi</td>
                    <td>Bảo hành</td>
                    <td>Không hỗ trợ đổi/trả</td>
                </tr>
                <tr>
                    <td rowSpan={3}>Voucher / E-voucher</td>
                    <td rowSpan={2}>30 ngày đầu tiên</td>
                    <td>Đổi mới</td>
                    <td rowSpan={2}>Không hỗ trợ đổi/trả</td>
                    <td rowSpan={2}>Không hỗ trợ đổi/trả</td>
                </tr>
                <tr>
                    <td>Trả hàng không thu phí</td>
                </tr>
                <tr>
                    <td>30 ngày trở đi</td>
                    <td colSpan={3}>Không hỗ trợ đổi trả</td>
                </tr>
                <tr>
                    <td rowSpan={3}>Các ngành hàng còn lại</td>
                    <td rowSpan={2}>30 ngày đầu tiên</td>
                    <td>Đổi mới</td>
                    <td rowSpan={2}>Trả hàng không thu phí</td>
                    <td rowSpan={3}>Không hỗ trợ đổi/trả</td>
                </tr>
                <tr>
                    <td>Trả không thu phí</td>
                </tr>
                <tr>
                    <td>30 ngày trở đi</td>
                    <td colSpan={2}>Không hỗ trợ đổi/trả</td>
                </tr>
                </tbody>
            </table>

            <ul className='mt-4'>
                <li>
                    Quý khách vui lòng thông báo ngay khi:
                    <ul>
                        <li>
                            Kiện hàng có dấu hiệu hư hại: trầy xước, gãy, móp, méo, ướt, bể vỡ... trong vòng 2 ngày kể từ khi nhận hàng.
                        </li>
                        <li>
                            Giao sai hàng hoặc thiếu hàng trong vòng 2 ngày kể từ khi nhận hàng.
                        </li>
                    </ul>
                </li>
                <li>
                    Sau khi Cửa hàng Nhựa Minh Hiệp xác nhận yêu cầu, chúng tôi sẽ liên hệ để xác nhận thông tin hoặc yêu cầu bổ sung nếu cần. Trường hợp không liên hệ được sau 3 lần trong vòng 7 ngày, chúng tôi sẽ từ chối xử lý.
                </li>
                <li>
                    Quá trình xử lý yêu cầu đổi/trả tối đa trong vòng 30 ngày kể từ khi khách nhận hàng.
                </li>
            </ul>

            <strong>2. Các trường hợp yêu cầu đổi trả</strong>
            <ul>
                <li>Lỗi kỹ thuật từ nhà sản xuất (sản phẩm thiếu linh kiện, hư hại...)</li>
                <li>Giao sai hoặc thiếu sản phẩm</li>
                <li>Chất lượng kém do vận chuyển</li>
                <li>Sản phẩm không giống mô tả</li>
                <li>Khách đặt nhầm / không còn nhu cầu (*)</li>
            </ul>

            <p>
                (*) Với sản phẩm không bị lỗi, chỉ chấp nhận đổi trả khi:
            </p>
            <ul>
                <li>Sản phẩm chưa qua sử dụng, còn nguyên tem/mác, bao bì nguyên vẹn</li>
                <li>Đầy đủ phụ kiện, phiếu bảo hành, quà tặng đi kèm (nếu có)</li>
            </ul>
        </div>
    );
};

export default ChinhSach;
