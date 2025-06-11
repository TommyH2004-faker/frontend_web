
import PlasticModels from "./PlasticModels";
class CartItemModel {
   id?: number;
   idCart?: any; // id san pham trong gio hang
   quantity: number; // so luong
   plasticItem:PlasticModels;// do nhua
   idUser?: number; // id nguoi dung
   review?: boolean; // da review chua

   constructor(quantity: number, plasticItem: PlasticModels) {
      this.quantity = quantity;
      this.plasticItem = plasticItem;
   }
}

export default CartItemModel;