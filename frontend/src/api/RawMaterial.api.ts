import {CreateRawMaterial, GetMaterial, Material, UpdateRawMaterial} from "@/types/material.ts";
import {useMutation, useQuery} from "react-query";
import {CreateUnitType, Unit, UpdateUnitType} from "@/types/unit.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetMaterial = ()=>{
    const accessToken = localStorage.getItem('token');
    const getMaterialRequest = async():Promise<{material:GetMaterial[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/material`,{
            method:"GET",
            headers:{ Authorization:`Bearer ${accessToken}`}

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        // if(response && response.status && response.status === 403 )
        //     toast.error("access denied");


        return {material:responseData, status:response.status}
    }
    const {data:materials, isLoading, error, refetch, isError} = useQuery('fetchRawMaterial',getMaterialRequest,
        {retry:1}
    )
    return {materials, isLoading, error, refetch ,isError}
}

export const useCreateRawMaterial = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRawMaterialRequest = async(brand:CreateRawMaterial):Promise<
        {
            unit?:Unit,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/material`,
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

        // if(response && response.status && response.status === 403 )
        //     toast.error("access denied");

        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { unit: responseData, status:response.status };
    }

    const {mutate:createRawMaterial, isLoading, isSuccess, error, data} = useMutation(createRawMaterialRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("raw material successfully added");
        },
    })

    return {createRawMaterial, isLoading, error, isSuccess, response:data}
}

export const useUpdateRawMaterial = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRawMaterialRequest = async(input:UpdateRawMaterial):Promise<
        {
            unit?:Material,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/material/${input.id}`,
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
        if(response && response.status && response.status === 403 )
            toast.error("access denied");


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { unit: responseData, status:response.status };
    }

    const {mutate:updateMaterial, isLoading, isSuccess, error, data} = useMutation(updateRawMaterialRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Raw material successfully updated");
        },
    })

    return {updateMaterial, isLoading, error, isSuccess, response:data}
}

export const useDeleteRawMaterial = ()=> {

    const accessToken = localStorage.getItem('token');
    const deleteRawMaterialRequest = async (id: number): Promise<
        {
            material?:Material,
            response?: FormErrors | { message: string};
            status:number
        }
    >=>{


        const response = await fetch(`${API_BASE_URL}/material/${id}`,{
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
        mutateAsync:deleteMaterial,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeleteRawMaterial", deleteRawMaterialRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Unit successfully deleted');
            if(data && data.status && data?.status === 409) toast.error('unable delete, because you have raw material with such unit');
        },

    })
    return {
        deleteMaterial,
        isLoading,
        error,
        isSuccess,
        data
    }
}