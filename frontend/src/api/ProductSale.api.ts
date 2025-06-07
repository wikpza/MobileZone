import {GetBudgetHistoryType, GetBudgetType} from "@/types/budget.ts";
import {toast} from "sonner";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {useMutation, useQuery} from "react-query";
import {number} from "zod";
import {GetProductSaleHistoryType, SaleProductType} from "@/types/product.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetProductSaleHistory = (beforeDate?:Date, toDate?:Date)=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{productSale:GetProductSaleHistoryType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/product/sale/history`,{
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


        return {productSale:responseData, status:response.status}
    }
    const {data, isLoading, isError, error, refetch} = useQuery('fetchProductSaleHistory',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useSaleProduct = ()=>{
    const accessToken = localStorage.getItem('token');

    const createRequest = async(input: SaleProductType):Promise<
        {
            productHistory?:GetProductSaleHistoryType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/product/sale`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`,},

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


        return { productHistory: responseData, status:response.status };
    }

    const {mutate:saleProduct, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("product successfully soled");
        },
    })

    return {saleProduct, isLoading, error, isSuccess, response:data}
}