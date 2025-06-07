import {CreateRawMaterial, GetMaterial, Material, UpdateRawMaterial} from "@/types/material.ts";
import {useMutation, useQuery} from "react-query";
import {CreateUnitType, Unit, UpdateUnitType} from "@/types/unit.ts";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {CreateProductType, GetProductType, Product, UpdateProductType} from "@/types/product.ts";
import {GetBudgetHistoryType, GetBudgetType, IncomeBudget, SetBonusType, SetMarkUpType} from "@/types/budget.ts";
import {number} from "zod";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetBudget = ()=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{budget:GetBudgetType, status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/budget`,{
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


        return {budget:responseData, status:response.status}
    }
    const {data, isLoading, isError, error, refetch} = useQuery('fetchBudget',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}
export const useGetBudgetHistory = ()=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{budgetHistory:GetBudgetHistoryType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/budget/history`,{
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


        return {budgetHistory:responseData, status:response.status}
    }
    const {data, isLoading, isError, error, refetch} = useQuery('fetchBudgetHistory',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}


export const useAddBudget = ()=>{

    const createRequest = async(input: IncomeBudget):Promise<
        {
            budget?:GetBudgetType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/budget`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({amount:input.amount, employeeId:input.employeeId})
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


        return { budget: responseData, status:response.status };
    }

    const {mutate:increaseBudget, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("budget successfully increased");
        },
    })

    return {increaseBudget, isLoading, error, isSuccess, response:data}
}
export const useUpdateMarkUp = ()=>{

    const updateRequest = async(input: SetMarkUpType):Promise<
        {
            budget?:GetBudgetType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/budget`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({markUp:input.markUp})
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


        return { budget: responseData, status:response.status };
    }

    const {mutate:updateItem, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("markup successfully updated");
        },
        onError:()=>{

        }
    })

    return {updateItem, isLoading, error, isSuccess, response:data}
}
export const useUpdateBonus = ()=>{

    const updateRequest = async(input: SetBonusType):Promise<
        {
            budget?:GetBudgetType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/budget/bonus`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({bonus:input.bonus})
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


        return { budget: responseData, status:response.status };
    }

    const {mutate:updateItem, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("bonus successfully updated");
        },
        onError:()=>{

        }
    })

    return {updateItem, isLoading, error, isSuccess, response:data}
}
