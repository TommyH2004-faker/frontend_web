import {endpointBE, endpointFE} from "../layouts/utils/Constant";
import RoleModel from "../models/RoleModel";
import {my_request, requestAdmin} from "./Request";



export async function getAllRoles(): Promise<RoleModel[]> {
   const endpoint = endpointFE + "/role";
   // Gọi phương thức request()
   const response = await requestAdmin(endpoint);

   const rolesList: RoleModel[] = response._embedded.roles.map((role: any) => ({
      ...role,
   }));

   return rolesList;
}


export async function getRoleByIdUser(idUser: any): Promise<RoleModel> {

   const endpoint = endpointFE + `/users/${idUser}/listRoles`;
   // Gọi phương thức request()
   const response = await my_request(endpoint);

   const rolesList: RoleModel[] = response._embedded.roles.map((role: any) => ({
      ...role,
   }));

   return rolesList[0];
}
