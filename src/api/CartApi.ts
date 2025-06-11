import {getIdUserByToken} from "../layouts/utils/JwtService";
import CartItemModel from "../models/CartItemModel";
import {my_request} from "./Request";
import {getPlasticByIdCartItem} from "./PlasticApi";


export async function getCartAllByIdUser(): Promise<CartItemModel[]> {
   const idUser = getIdUserByToken();
   const endpoint = "http://localhost:8080" + `/users/${idUser}/listCartItems`;
   try {
      const cartResponse = await my_request(endpoint);
      if (cartResponse) {
         return await Promise.all(cartResponse._embedded.cartItems.map(async (item: any) => {
            const plasticResponse = await getPlasticByIdCartItem(item.idCart);
            return {...item, plasticItem: plasticResponse};
         }));
      }
   } catch (error) {
      console.error('Error: ', error);
   }
   return [];
}

