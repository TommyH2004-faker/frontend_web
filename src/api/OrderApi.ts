import {endpointBE, endpointFE} from "../layouts/utils/Constant";
import {my_request} from "./Request";
import OrderModel from "../models/OrderModel";
import CartItemModel from "../models/CartItemModel";



export async function getAllOrders(): Promise<OrderModel[]> {
    try {
        const endpoint: string = endpointFE + "/orders?sort=idOrder,desc&size=100000";
        const response = await my_request(endpoint);

        const datas = await Promise.all(response._embedded.orders.map(async (data: any) => {
            const responsePayment = await  my_request(endpointFE + `/orders/${data.idOrder}/payment`);
            return {
                idOrder: data.idOrder,
                deliveryAddress: data.deliveryAddress,
                totalPrice: data.totalPrice,
                totalPriceProduct: data.totalPriceProduct,
                feeDelivery: data.feeDelivery,
                feePayment: data.feePayment,
                dateCreated: data.dateCreated,
                status: data.status,
                /* user: data._links.user,*/
                fullName: data.fullName,
                note: data.note,
                payment: responsePayment.namePayment,
            };
        }));

        return datas;
    } catch (error) {
        console.error("Error while fetching orders:", error);
        throw error;
    }
}


export async function getAllOrdersByIdUser(idUser: number): Promise<OrderModel[]> {
    const endpoint = endpointFE + `/users/${idUser}/listOrders?sort=idOrder,desc`;
    const response = await  my_request(endpoint);
    console.log(response);
    const datas = await Promise.all(response._embedded.
    orders.map(async (data: any) => {
        const responsePayment = await  my_request(endpointFE + `/orders/${data.idOrder}/payment`);
        const order: OrderModel = {
            idOrder: data.idOrder,
            deliveryAddress: data.deliveryAddress,
            totalPrice: data.totalPrice,
            totalPriceProduct: data.totalPriceProduct,
            feeDelivery: data.feeDelivery,
            feePayment: data.feePayment,
            dateCreated: data.dateCreated,
            status: data.status,
            /*user: data._embedded.user,*/
            fullName: data.fullName,
            note: data.note,
            payment: responsePayment.namePayment,
        }
        return order;
    }))

    return datas;
}

export async function get1Orders(idOrder: number): Promise<OrderModel> {
    const endpoint: string = endpointFE + `/orders/${idOrder}`;
    const responseOrder = await  my_request(endpoint);
    const responsePayment = await  my_request(endpointFE + `/orders/${responseOrder.idOrder}/payment`);
    const responseOrderDetail = await  my_request(endpointFE + `/orders/${responseOrder.idOrder}/listOrderDetails`);
    let cartItems: CartItemModel[] = [];

    // Sử dụng Promise.all để chờ tất cả các promise hoàn thành
    await Promise.all(responseOrderDetail._embedded.orderDetails.map(async (orderDetail: any) => {
        const responsePlastic = await  my_request(endpointFE + `/order-details/${orderDetail.idOrderDetail}/plasticItem`);
        cartItems.push({ plasticItem: responsePlastic, quantity: orderDetail.quantity, review: orderDetail.review });
    }));

    const order: OrderModel = {
        idOrder: responseOrder.idOrder,
        deliveryAddress: responseOrder.deliveryAddress,
        totalPrice: responseOrder.totalPrice,
        totalPriceProduct: responseOrder.totalPriceProduct,
        feeDelivery: responseOrder.feeDelivery,
        feePayment: responseOrder.feePayment,
        dateCreated: responseOrder.dateCreated,
        status: responseOrder.status,
        /* user: responseOrder._embedded.user,*/
        fullName: responseOrder.fullName,
        phoneNumber: responseOrder.phoneNumber,
        note: responseOrder.note,
        cartItems: cartItems,
        payment: responsePayment.namePayment,
    }

    return order;
}