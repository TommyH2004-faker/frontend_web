
import PlasticModels from "./PlasticModels";
class CartItemModel {
   id?: number;
   idCart?: any; // id san pham trong gio hang
   quantity: number; // so luong
   pllastic:PlasticModels[]// do nhua
   idUser?: number; // id nguoi dung
   review?: boolean; // da review chua

   constructor(quantity: number,pllastic:PlasticModels[]) {
      this.quantity = quantity;
        this.pllastic = pllastic;
   }
}

export default CartItemModel;