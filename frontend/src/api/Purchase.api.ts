import {toast} from "sonner";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {useMutation, useQuery} from "react-query";
import {GetPurchaseType, MakeRawMaterialPurchaseType} from "@/types/purchase.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetPurchaseHistory = (beforeDate?:Date, toDate?:Date)=>{
    const params = new URLSearchParams();

    if (beforeDate !== undefined) {
        params.append('beforeDate', beforeDate.toString());
    }
    if (toDate !== undefined) {
        params.append('toDate', toDate.toString());

    }
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{purchase?:GetPurchaseType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/purchase/history${params.toString() ? `?${params.toString()}` : ''}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
                'Content-Type': "application/json"
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        return {purchase:responseData, status:response.status}
    }
    const {data, isLoading, isError, error, refetch} = useQuery('fetchPurchaseHistory',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useMakeRawMaterialPurchase = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRequest = async(input:MakeRawMaterialPurchaseType):Promise<
        {
            purchase?:GetPurchaseType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/purchase`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`
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


        return { purchase: responseData, status:response.status };
    }

    const {mutate:createRawMaterial, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("raw material purchase successfully made");
        },
    })

    return {createRawMaterial, isLoading, error, isSuccess, response:data}
}