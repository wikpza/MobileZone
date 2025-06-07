import {FormErrors, handleServerError, isFormErrors, isValidJSON} from "../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {useMutation, useQuery} from "react-query";
import {
    CreateEmployeeType,
    EmployeeTokenType, GetEmployeeData,
    GetEmployeeType,
    LoginEmployeeType, UpdateEmployeeDataType,
    UpdateEmployeeType
} from "@/types/employee.ts";
import {jwtDecode} from "jwt-decode";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateEmployee = ()=>{
    const accessToken = localStorage.getItem('token');
    const createRequest = async(brand:CreateEmployeeType):Promise<
        {
            employee?:GetEmployeeType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/employee`,
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:`Bearer ${accessToken}`,},
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


        return { employee: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("Employee successfully added");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}

export const useGetEmployee = ()=>{
    const accessToken = localStorage.getItem('token');

    const getRequest = async():Promise<{ employees:GetEmployeeType[], status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/employee`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {employees:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchEmployee',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useUpdateEmployee = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRequest = async(input:UpdateEmployeeType):Promise<
        {
            employee?:GetEmployeeType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const response = await fetch(`${API_BASE_URL}/employee/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(
                    {
                        firstName: input.firstName,
                        lastName: input.lastName,
                        middleName: input.middleName,
                        phone: input.phone,
                        salary: input.salary,
                        address: input.address,
                        positionId: input.positionId
                    }
                )
            })


        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        // if(response && response.status && response.status === 403 )
        //     toast.error("access denied");


        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { employee: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Employee successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}

export const useUpdateEmployeeData = ()=>{
    const accessToken = localStorage.getItem('token');

    const updateRequest = async(input:UpdateEmployeeDataType):Promise<
        {
            employee?:GetEmployeeType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{

        const response = await fetch(`${API_BASE_URL}/employee/data/${input.id}`,
            {
                method:"PATCH",
                headers:{
                    Authorization:`Bearer ${accessToken}`,
                    "Content-Type": "application/json"},
                body:JSON.stringify(
                    {
                        login: input.login,
                        password: input.password,
                    }
                )
            })


        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }

        // if(response && response.status && response.status === 403 )
        //     toast.error("access denied");


        if(isValidJSON(responseData)){
            const parsedData = JSON.parse(responseData)
            if (!(responseData.token) && isFormErrors(parsedData) &&   response.status >= 400 && response.status < 500) {
                return {response:parsedData, status:response.status}
            }
        }


        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { employee: responseData, status:response.status };
    }

    const {mutate:update, isLoading, isSuccess, error, data} = useMutation(updateRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status >= 200 && data?.status < 300)
                toast.success("Employee successfully updated");
        },
    })

    return {update, isLoading, error, isSuccess, response:data}
}

export const useDeleteEmployee = ()=> {
    const accessToken = localStorage.getItem('token');
    const deleteProductRequest = async (id: string): Promise<
        {
            employee?:GetEmployeeType,
            response?: FormErrors | { message: string};
            status:number
        }
    >=>{


        const response = await fetch(`${API_BASE_URL}/employee/${id}`,{
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


        return {employee:responseData, status:response.status}
    }

    const {
        mutateAsync:deleteEmployee,
        isLoading,
        error,
        isSuccess,
        data
    } = useMutation("DeleteEmployee", deleteProductRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data && data.status && data?.status >= 200 && data?.status < 300) toast.success('Employee successfully deleted');
            if(data && data.status && data?.status === 409) toast.error(data.response.message);
        },

    })
    return {
        deleteEmployee,
        isLoading,
        error,
        isSuccess,
        data
    }
}

export const useLoginMyUser = () => {
    const loginMyUserRequest = async (user: LoginEmployeeType): Promise<{
        user?: EmployeeTokenType;
        response?: FormErrors | { message: string};
        status:number
    }> => {
        console.log(API_BASE_URL)
        const response = await fetch(`${API_BASE_URL}/employee/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
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

        localStorage.setItem("token", responseData.token as string);
        const userData = await jwtDecode<EmployeeTokenType>(responseData.token);

        if (responseData && responseData.message && response.status !== 200) {
            return { response: { message: responseData.message}, status:response.status };
        }


        return { user: userData, status:response.status };
    };

    // Используем useMutation внутри пользовательского хука
    const { mutateAsync: loginUser, isLoading, error, isSuccess, data, isError } = useMutation(loginMyUserRequest, {
        retry: 0,
        onSuccess: (dataUser) => {
            console.log(dataUser)
            if(dataUser?.status === 201){
                toast.success("You have successfully logged in.");
                console.log(dataUser.status)
            }
        },
    });

    // Возвращаем данные хука
    return {
        loginUser,
        isLoading,
        error,
        isSuccess,
        userData: data,
        isError,
    };
};

export const useGetPersonalData = ()=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{ employees:GetEmployeeType, status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/employee/data`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {employees:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchEmployeePersonalData',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}

export const useGetPersonalStatic = (id:number)=>{
    const accessToken = localStorage.getItem('token');
    const getRequest = async():Promise<{ employees:GetEmployeeData, status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/employee/static/${id}`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {employees:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchEmployeePersonalStatic',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}



export const useSetDirector = ()=>{
    const accessToken = localStorage.getItem('token');
    const createRequest = async(input:{employeeId:number}):Promise<
        {
            employee?:GetEmployeeType,
            response?: FormErrors | { message: string};
            status:number
        }>=>{


        const response = await fetch(`${API_BASE_URL}/employee/director`,
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


        return { employee: responseData, status:response.status };
    }

    const {mutate:create, isLoading, isSuccess, error, data} = useMutation(createRequest, {
        retry:0,
        onSuccess: (data) => {
            if(data?.status === 201)
                toast.success("Director successfully selected");
        },
    })

    return {create, isLoading, error, isSuccess, response:data}
}
export const useGetDirector = ()=>{
    const accessToken = localStorage.getItem('token');

    const getRequest = async():Promise<{ employees:GetEmployeeType | null, status:number}>=>{

        const response = await fetch(`${API_BASE_URL}/employee/director`,{
            method:"GET",
            headers:{
                Authorization:`Bearer ${accessToken}`,
            }

        })
        const responseData = await response.json();

        if(response && response.status && response.status>=500 && response.status<600){
            toast.error(handleServerError({status:response.status}))
        }


        return {employees:responseData, status:response.status}
    }
    const {data, isLoading, error, refetch, isError} = useQuery('fetchEmployeeDirector',getRequest,
        {retry:1}
    )
    return {data, isLoading, error, refetch, isError}
}
