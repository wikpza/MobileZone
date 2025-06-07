import {AddInstruction, GetInstruction, UpdateInstructionQuantity} from "@/types/instruction.ts";
import {useMutation, useQuery} from "react-query";
import {Material} from "@/types/material.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const useGetInstruction = (id:number)=>{
    const accessToken = localStorage.getItem('token');

    const getRequest = async():Promise<{instructions:GetInstruction[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/ingredient/product/${id}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        return {instructions:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchInstruction',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}
//
export const useAddInstruction = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRequest = async(data:AddInstruction):Promise<
        {
            material?:Material,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/ingredient/product/${data.productId}`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({materialId:data.materialId, quantity:data.quantity})
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


        return { material: responseData, status:response.status };
    }

    const {mutate:add, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("material successfully added");
        },
    })

    return {add, isLoading, error, isSuccess, response:data}
}

export const useUpdateInstruction = ()=>{

    const updateRequest = async(input:UpdateInstructionQuantity):Promise<
        {
            material?:Material,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/ingredient/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({quantity:input.quantity})
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


        return { material: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Ingredient successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}

export const useDeleteInstruction = ()=> {

    const accessToken = localStorage.getItem('token');
    const deleteRequest = async (id: number): Promise<
        {
            material?:Material,
            response?: FormErrors | { message: string};
            status:number
        }
    >=>{


        const response = await fetch(`${API_BASE_URL}/ingredient/${id}`,{
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

        if(response && response.status && response.status === 403 )
            toast.error("access denied");


        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        return {material:responseData, status:response.status}
    }

    const {
        mutateAsync:deleteProduct,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeleteIngredient", deleteRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Ingredient successfully deleted');
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