
import express from "express";
import EmployeeRoutes from './api/employee.api'
import PositionRoutes from './api/position.api'
import UnitRoutes from './api/unit.api'
import ProductRoutes from './api/product.api'
import IngredientRoutes from './api/ingredient.api'
import RawMaterialRoutes from './api/rawMaterial.api'
import BudgetRoutes from './api/budget.api'
import PurchaseRoutes from './api/purchase.api'
import ManufacturingRoutes from './api/manufacturing.api'
import PermissionRoutes from './api/permissions.api'
import SalaryRoutes from "./api/salary.api"
import LoanRoutes from './api/loan.api'
import cors from "cors";

const app = express()

app.use(express.json())
app.use(cors());
app.use("/purchase", PurchaseRoutes)
app.use("/employee", EmployeeRoutes)
app.use("/position", PositionRoutes)
app.use("/unit", UnitRoutes)
app.use('/product', ProductRoutes)
app.use('/ingredient', IngredientRoutes)
app.use("/material", RawMaterialRoutes)
app.use("/budget", BudgetRoutes)
app.use('/manufacturing', ManufacturingRoutes)
app.use('/permission', PermissionRoutes)
app.use("/salary", SalaryRoutes)
app.use("/loan", LoanRoutes)

export default app