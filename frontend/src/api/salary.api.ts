
import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";
import {CreateEmployeeType, GetEmployeeType, UpdateEmployeeType} from "@/types/employee.ts";
import {Product, UpdateProductType} from "@/types/product.ts";
import {Unit} from "@/types/unit.ts";
import {
    changeSalaryStatus,
    ChangeTotalSalary,
    GenerateSalaryOption,
    GetSalaryList,
    GetSalaryOption
} from "@/types/salary.ts";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const useGetSalaryList = (input:GetSalaryOption)=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{
        data?:GetSalaryList[],
        response?: FormErrors | { message: string};
        status:number
    }>=>{

        const response = await fetch(`${API_BASE_URL}/salary?month=${input.month}${input.year && `&year=${input.year}`}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
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


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { data: responseData, status:response.status };

    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchEmployeeSalary',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useUpdateSalary = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRequest = async(input:ChangeTotalSalary):Promise<
        {
            salary?:GetSalaryList,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/salary/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`},
                body:JSON.stringify(
                    {
                        salary: input.salary,
                    }
                )
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


        return { salary: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Salary successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}

export const useGiveSalary = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRequest = async(input:{year:number, month:number}):Promise<
        {
            salary?:GetSalaryList,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/salary/status`,
            {
                method:"PATCH",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`},
                body:JSON.stringify(
                    {
                        month:input.month,
                        year:input.year
                    }
                )
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


        return { salary: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Salary successfully given");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}



// export const useUpdateSalaryStatus = ()=>{
//
//     const updateRequest = async(input:changeSalaryStatus):Promise<
//         {
//             salary?:GetSalaryList,
//             response?: FormErrors | { message: string};
//             status:number
//         }>=>{
//
//
//         const response = await fetch(`${API_BASE_URL}/salary/status/${input.id}`,
//             {
//                 method:"PATCH",
//                 headers:{
//                     "Content-Type": "application/json"},
//                 body:JSON.stringify(
//                     {
//                         employeeId: input.employeeId,
//                     }
//                 )
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
//         return { salary: responseData, status:response.status };
//     }
//
//     const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
//         retry:0,
//         onSuccess: (data) => {
//             if(data?.status >= 200 && data?.status < 300)
//                 toast.success("Status successfully updated");
//         },
//     })
//
//     return {update, isLoading, error, isSuccess, response:data}
// }

