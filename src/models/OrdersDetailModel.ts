
import PlasticModels from "./PlasticModels";

class OrdersDetailModel {
    idOrdersDetail?: number;

    pllastics:PlasticModels;
    quantity: number;
    price: number;

    constructor(pllastics:PlasticModels, quantity: number, price: number) {
        this.pllastics = pllastics;
        this.quantity = quantity;
        this.price = price;
    }
}

export default OrdersDetailModel;
