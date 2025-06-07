import {useMutation, useQuery} from "react-query";
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {GetLoanPaymentType, GetLoanType, PayLoanType, ResultPayLoanType, TakeLoanType} from "@/types/loan.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const useGetLoan = ()=>{
    const accessToken = localStorage.getItem('token');


    const getRequest = async():Promise<{loans:GetLoanType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/loan`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {loans:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchLoan',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useTakeLoan = ()=>{

    const createRequest = async(input:TakeLoanType):Promise<
        {
            loan?:GetLoanType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/loan`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
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


        return { loan: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("loan successfully taken");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}

export const useGetLoanPayment = (loanId?:number, beforeDate?:Date, toDate?:Date)=>{
    const accessToken = localStorage.getItem('token');

    const params = new URLSearchParams();

    if (beforeDate !== undefined) {
        params.append('beforeDate', beforeDate.toString());
    }
    if (toDate !== undefined) {
        params.append('toDate', toDate.toString());
    }

    if(loanId){
        params.append('loanId', loanId)
    }
    const getRequest = async():Promise<{payment:GetLoanPaymentType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/loan/payment${params.toString() ? `?${params.toString()}` : ''}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {payment:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchLoanPayment',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

function toLocalISO(date) {
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const usePayLoan = ()=>{

    const createRequest = async(input:PayLoanType):Promise<
        {
            loan?:GetLoanType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const accessToken = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/loan/payment`,
            {
                method:"POST",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify({...input, giveDate:toLocalISO(input.giveDate)
                })
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


        return { loan: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("loan successfully payed");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}


export const useGetCountLoanPayment = (input:{loanId?:string, giveDate:Date})=>{
    const accessToken = localStorage.getItem('token');

    const getRequest = async():Promise<{result:ResultPayLoanType, status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/loan/payment/count?loanId=${input.loanId}&giveDate=${input.giveDate}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }


        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {result:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchCountLoanPayment',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}