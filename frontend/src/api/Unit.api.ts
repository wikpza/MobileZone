import {useMutation, useQuery} from "react-query";
import {CreateUnitType, GetUnit, Unit, UpdateUnitType} from "@/types/unit.ts";
import {toast} from "sonner";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetUnits = ()=>{
    const accessToken = localStorage.getItem('token');
    const getUnitsRequest = async():Promise<{units?:GetUnit[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/unit`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })

        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }
        return {units:responseData, status:response.status}
    }
    const {data:units, isLoading, error, refetch} = useQuery('fetchUnits',getUnitsRequest,
        {retry:1}
    )
    return {units, isLoading, error, refetch}
}
export const useGetAdminUnits = ()=>{
    const accessToken = localStorage.getItem('token');
    const getUnitsRequest = async():Promise<GetUnit[]>=>{

        const response = await fetch(`${API_BASE_URL}/unit/admin`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }
        })
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.toString());
        }
        return response.json()
    }
    const {data:units, isLoading, error, refetch} = useQuery('fetchUnits',getUnitsRequest,
        {retry:1}
    )
    return {units, isLoading, error, refetch}
}
export const useCreateUnit = ()=>{
    const accessToken = localStorage.getItem('token');

    const createUnitRequest = async(brand:CreateUnitType):Promise<
        {
            unit?:Unit,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/unit`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`,

                },
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

    const {mutate:createUnit, isLoading, isSuccess, error, data} = useMutation(createUnitRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("unit successfully added");
        },

    })

    return {createUnit, isLoading, error, isSuccess, response:data}
}
export const useUpdateUnit = ()=>{
    const accessToken = localStorage.getItem('token');
    const updateUnitRequest = async(input:UpdateUnitType):Promise<
        {
            unit?:Unit,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const response = await fetch(`${API_BASE_URL}/unit/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`,
                },
                body:JSON.stringify({name:input.name})
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


        return { unit: responseData, status:response.status };
    }

    const {mutate:updateUnit, isLoading, isSuccess, error, data} = useMutation(updateUnitRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("unit successfully updated");
        },
    })

    return {updateUnit, isLoading, error, isSuccess, response:data}
}
export const useDeleteUnit = ()=> {
    const accessToken = localStorage.getItem('token');

    const deleteProductRequest = async (id: string): Promise<
        {
            unit?:Unit,
            response?: FormErrors | { message: string};
            status:number
        }
>=>{


        const response = await fetch(`${API_BASE_URL}/unit/${id}`,{
            method:"DELETE",
            headers:{
                'Content-Type': "application/json",
                Authorization:`Bearer ${accessToken}`,

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


        return {unit:responseData, status:response.status}
    }

    const {
        mutateAsync:deleteUnit,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeleteUnit", deleteProductRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Unit successfully deleted');
            if(data && data.status && data?.status === 409) toast.error(data.response.message);
        },

    })
    return {
        deleteUnit,
        isLoading,
        error,
        isSuccess,
        data
    }
}