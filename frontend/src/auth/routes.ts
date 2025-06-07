
import UnitsPage from "@/pages/admin/UnitPage/UnitsPage.tsx";
import EmployeesPage from "@/pages/admin/EmployeePage/EmployeesPage.tsx";
import PositionsPage from "@/pages/admin/PositionPage/PositionsPage.tsx";
import MaterialsPage from "@/pages/admin/RawMaterialPage/MaterialsPage.tsx";
import ProductsPage from "@/pages/admin/ProductPage/ProductsPage.tsx";
import InstructionsPage from "@/pages/admin/InstructionsPage/InstructionsPage.tsx";
import {LoginPage} from "@/pages/auth/LoginPage.tsx";
import BudgetPage from "@/pages/admin/BudgetPage/BudgetPage.tsx";
import ProcurementPage from "@/pages/admin/ProcurementPage/ProcurementPage.tsx";
import ManufacturingPage from "@/pages/admin/ManufacturingPage/ManufactruringPage.tsx";
import ProductSalePage from "@/pages/admin/ProductSalePage/ProductSalePage.tsx";
import PermissionsPage from "@/pages/admin/PermissionPage/PermisitionPage.tsx";
import SalaryPage from "@/pages/admin/SalaryPage/SalaryPage.tsx";
import LoansPage from "@/pages/admin/LoanPage/LoanPage.tsx";
import LoanRepaymentPage from "@/pages/admin/LoanPaymentPage/LoanPayementPage.tsx";
import AdminProfilePage from "@/pages/admin/ProfilePage/AdminProfilePage.tsx";
import ReportPage from "@/pages/admin/ReportPage/ReportPage.tsx";

export const publicRoutes = [
    // {
    //     path: '/',
    //     Component: Index,
    // },
    {
        path: '/login',
        Component: LoginPage
    },
    // {
    //     path:"/register",
    //     Component:RegisterPage
    // },
    // {
    //     path: '/profile',
    //     Component: ProfilePage
    // },

];


export const adminRoutes = [
    {
        path: 'profile',
        Component: AdminProfilePage,
    },
    {
        path: 'units',
        Component: UnitsPage,
    },

    {
        path: 'employees',
        Component: EmployeesPage,
    },

    {
        path: 'positions',
        Component: PositionsPage,
    },

    {
        path:"permissions",
        Component: PermissionsPage
    },

    {
        path: 'materials',
        Component: MaterialsPage,
    },
    {
        path: 'products',
        Component: ProductsPage,
    },

    {
        path: 'instructions',
        Component: InstructionsPage,
    },
    {
        path: 'procurement',
        Component: ProcurementPage,
    },
    {
        path:"manufacturing",
        Component:ManufacturingPage
    },
    {
        path: 'sales',
        Component: ProductSalePage,
    },
    {
        path: 'materials',
        Component: MaterialsPage,
    },
    {
        path: 'materials',
        Component: MaterialsPage,
    },
    {
        path: 'budget',
        Component: BudgetPage,
    },
    {
        path: 'salary',
        Component: SalaryPage,
    },
    {
        path: "Loans",
        Component: LoansPage,
    },
    {
        path: "loan-repayment",
        Component: LoanRepaymentPage,
    },
    {
        path: "report",
        Component: ReportPage,
    }
]