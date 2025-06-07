import {useMutation, useQuery} from "react-query";
import {CreatePositionType, GetPosition} from "@/types/position.ts";
import {CreateUnitType, Unit, UpdateUnitType} from "@/types/unit.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetPositions = ()=>{
    const accessToken = localStorage.getItem('token');

    const getRequest = async():Promise<{positions:GetPosition[], status:number}>=>{
        const response = await fetch(`${API_BASE_URL}/position`,{
            method:"GET",
            headers:{ Authorization:`Bearer ${accessToken}`}

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        return {positions:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchPositions',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}
export const useCreatePosition = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRequest = async(input:CreatePositionType):Promise<
        {
            data?:GetPosition,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/position`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`,
                },
                body:JSON.stringify(input)
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


        return { data: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("position successfully added");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}
export const useUpdatePosition = ()=>{
    const accessToken = localStorage.getItem('token');
    const updateRequest = async(input:UpdateUnitType):Promise<
        {
            data?:GetPosition,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/position/${input.id}`,
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


        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { data: responseData, status:response.status };
    }

    const {mutate:updateUnit, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Position successfully updated");
        },
    })

    return {updateUnit, isLoading, error, isSuccess, response:data}
}
export const useDeletePosition = ()=> {
    const accessToken = localStorage.getItem('token');

    const deleteRequest = async (id: string): Promise<
        {
            data?:GetPosition,
            response?: FormErrors | { message: string};
            status:number
        }
    >=>{


        const response = await fetch(`${API_BASE_URL}/position/${id}`,{
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


        return {data:responseData, status:response.status}
    }

    const {
        mutateAsync:deleteData,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeletePosition", deleteRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Position successfully deleted');
            if(data && data.status && data?.status === 409) toast.error(data.response.message);
        },

    })
    return {
        deleteData,
        isLoading,
        error,
        isSuccess,
        data
    }
}