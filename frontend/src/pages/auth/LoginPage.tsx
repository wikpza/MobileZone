import { observer } from "mobx-react-lite";
import {LoginForm} from "@/components/forms/LoginForm.tsx";
import {useLoginMyUser} from "@/api/Employee.api.ts";
import {Toaster} from "sonner";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";



export const LoginPage = observer(() => {
    const {loginUser, userData, isSuccess} = useLoginMyUser()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(userData && userData.status && userData.status >= 200 && userData.status < 300)
            if (userData && userData.status && userData.status >= 200 && userData.status < 300) {
                navigate('/admin/profile')
            }
        }, [isSuccess]);

  return (
     <div>
         <Toaster position={'top-center'}/>
       <LoginForm response={userData?.response } status={userData?.status} onSave={loginUser}/>
     </div>
  );
});
