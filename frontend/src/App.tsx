import {Routes, Route, useNavigate} from "react-router-dom"
import AdminLayout from "./components/layout/AdminLayout.tsx"
import AdminDashboard from "./pages/admin/AdminDashboard"
import {jwtDecode} from "jwt-decode";
import {useContext} from "react";
import {Context} from "@/main.tsx";
import {runInAction} from "mobx";
import LoadingOverlay from "@/components/layout/LoadingOveraly.tsx";
import {adminRoutes, publicRoutes} from "@/auth/routes.ts";
import {LoginPage} from "@/pages/auth/LoginPage.tsx";




let employeeData:{
    id: number,
    lastName:string,
    firstName:string,
    middleName:string,
    login:string,
    phone:string,
}

const token = localStorage.getItem('token');

function App() {
    const navigate = useNavigate()
    if (token) {
        try {
            const decoded = jwtDecode<{
                id: number;
                lastName: string;
                firstName: string;
                middleName: string;
                login: string;
                phone: string;
                exp: number;
            }>(token);

            // Проверяем expiration time (exp - в секундах)
            const isExpired = decoded.exp * 1000 < Date.now();

            if (isExpired) {
                console.log('Токен просрочен');
                navigate('/login')
                localStorage.removeItem('token');
                // Дополнительные действия при просрочке...
            } else {
                console.log('Токен действителен');
                employeeData = decoded;
            }
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
            localStorage.removeItem('token'); // Удаляем невалидный токен
        }
    }
    const context = useContext(Context);

    if (!context) {
        throw new Error('Context is not available');
    }

    const {employee, overlay} = context

    if (employeeData) {
        runInAction(() => {
            employee.setEmployee({
                id: employeeData.id,
                login: employeeData.login,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                middleName: employeeData.middleName,
                phone:employeeData.phone
            });
            employee.setIsAuth(true);
        });
    }


  return (
      <LoadingOverlay isLoading={overlay.isLoading} className={`!w-[100vw] !h-[100vh] ${overlay.isLoading && "!fixed"}`} size={(15 / 100) * window.innerWidth}>
          <Routes>
              {/*<Route path="*" element={<NotFound />} />*/}
              <Route path="*" element={<LoginPage/>} />


              {
                  publicRoutes.map((route, index) => (
                      <Route key={index} path={route.path} element={<route.Component/>}/>))
              }


              { employee.isAuth &&
                  <Route path="/admin" element={<AdminLayout />}>

                      <Route index element={<AdminDashboard />} />
                      {adminRoutes.map((route, index) => (
                          <Route key={index} path={route.path} element={<route.Component/>} />
                      ))}

                  </Route>
              }


          </Routes>
      </LoadingOverlay>
  )
}

export default App