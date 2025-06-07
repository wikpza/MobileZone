import {useMutation, useQuery} from "react-query";
import {GetPermissionsList, GetPositionPermission, UpdatePositionPermission} from "@/types/permisions.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetPermissions = ()=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{permission: GetPermissionsList[], status:number}>=>{
        const response = await fetch(`${API_BASE_URL}/permission`,{
            method:"GET",
            headers:{ Authorization:`Bearer ${accessToken}`}

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        if(response && response.status && response.status === 403 )
            toast.error("access denied");


        return {permission:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchPermissions',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useGetPositionPermissions = (positionId:number)=>{
    const getRequest = async():Promise<GetPositionPermission[]>=>{
        const accessToken = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/permission/${positionId}`,{
            method:"GET",
            headers:{ Authorization:`Bearer ${accessToken}`}

        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchPositionPermissions',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useUpdatePositionPermission = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRequest = async(input:UpdatePositionPermission):Promise<
        {
            permission?:Permissions,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/permission`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({positionId:input.positionId, permissionId:input.permissionId, type:input.type})
            })


        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        if(response && response.status && response.status === 403 )
            toast.error("access denied");

        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { permission: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("permission successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}



//
// export const useCreateProduct = ()=>{
//
//     const createRequest = async(brand:CreateProductType):Promise<
//         {
//             unit?:Unit,
//             response?: FormErrors | { message: string};
//             status:number
//         }>=>{
//
//         const accessToken = localStorage.getItem('token');
//
//         const response = await fetch(`${API_BASE_URL}/product`,
//             {
//                 method:"POST",
//                 headers:{
//                     Authorization:`Bearer ${accessToken}`,
//                     "Content-Type": "application/json"},
//                 body:JSON.stringify(brand)
//             })
//
//
//         const responseData = await response.json();
//
//         if(response && response.status && response.status>=500 && response.status<600){
//             toast.error(handleServerError({status:response.status}))
//         }
//
//         if(isValidJSON(responseData)){
//             const parsedData = JSON.parse(responseData)
//             if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
//                 return {response:parsedData, status:response.status}
//             }
//         }
//
//
//         if (responseData && responseData.message && response.status !== 200) {
//             return { response: { message: responseData.message}, status:response.status };
//         }
//
//
//         return { unit: responseData, status:response.status };
//     }
//
//     const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
//         retry:0,
//         onSuccess: (data) => {
//             if(data?.status === 201)
//                 toast.success("product successfully added");
//         },
//     })
//
//     return {create, isLoading, error, isSuccess, response:data}
// }
//

//
// export const useDeleteProduct = ()=> {
//
//     const accessToken = localStorage.getItem('token');
//     const deleteRequest = async (id: number): Promise<
//         {
//             product?:GetProductType,
//             response?: FormErrors | { message: string};
//             status:number
//         }
//     >=>{
//
//
//         const response = await fetch(`${API_BASE_URL}/product/${id}`,{
//             method:"DELETE",
//             headers:{
//                 Authorization:`Bearer ${accessToken}`,
//                 'Content-Type': "application/json"
//             }
//         })
//
//         const responseData = await response.json();
//
//         if(response && response.status && response.status>=500 && response.status<600){
//             toast.error(handleServerError({status:response.status}))
//         }
//
//         if(isValidJSON(responseData)){
//             const parsedData = JSON.parse(responseData)
//             if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
//                 return {response:parsedData, status:response.status}
//             }
//         }
//
//
//         return {product:responseData, status:response.status}
//     }
//
//     const {
//         mutateAsync:deleteProduct,
//         isLoading,
//         error,
//         isSuccess,
//         data
//     } = useMutation("DeleteProduct", deleteRequest, {
//         retry:0,
//         onSuccess: (data) => {
//             if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Unit successfully deleted');
//             if(data && data.status && data?.status === 409) toast.error('unable delete, because you have raw material with such unit');
//         },
//
//     })
//     return {
//         deleteProduct,
//         isLoading,
//         error,
//         isSuccess,
//         data
//     }
// }