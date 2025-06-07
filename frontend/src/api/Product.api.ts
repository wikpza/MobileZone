import {CreateRawMaterial, GetMaterial, Material, UpdateRawMaterial} from "@/types/material.ts";
import {useMutation, useQuery} from "react-query";
import {CreateUnitType, Unit, UpdateUnitType} from "@/types/unit.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {CreateProductType, GetProductType, Product, UpdateProductType} from "@/types/product.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetProduct = ()=>{
    const accessToken = localStorage.getItem('token');
    console.log(API_BASE_URL)

    const getRequest = async():Promise<{product:GetProductType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/product`,{
            method:"GET",
            headers:{ Authorization:`Bearer ${accessToken}`}
        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {product:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchProduct',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useCreateProduct = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRequest = async(brand:CreateProductType):Promise<
        {
            unit?:Unit,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/product`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(brand)
            })


        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { unit: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("product successfully added");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}

export const useUpdateProduct = ()=>{

    const updateRequest = async(input:UpdateProductType):Promise<
        {
            product?:Product,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/product/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({name:input.name, unitId:input.unitId})
            })


        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { product: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Product successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}

export const useDeleteProduct = ()=> {

    const accessToken = localStorage.getItem('token');
    const deleteRequest = async (id: number): Promise<
        {
            product?:GetProductType,
            response?: FormErrors | { message: string};
            status:number
        }
    >=>{


        const response = await fetch(`${API_BASE_URL}/product/${id}`,{
            method:"DELETE",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }
        })

        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }



        return {product:responseData, status:response.status}
    }

    const {
        mutateAsync:deleteProduct,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeleteProduct", deleteRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Unit successfully deleted');
            if(data && data.status && data?.status === 409) toast.error('unable delete, because you have raw material with such unit');
        },

    })
    return {
        deleteProduct,
        isLoading,
        error,
        isSuccess,
        data
    }
}

