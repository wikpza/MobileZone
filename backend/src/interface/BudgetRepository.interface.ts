import {GetBudgetHistoryType, GetBudgetType, IncomeBudgetType, UpdateBonus, UpdateMarkUp} from "../models/budget.model";
import {Budget, BudgetHistory} from "../database/models";

export interface IBudgetRepository{
    getBudget():Promise<Budget>
    incomeBudget(input:IncomeBudgetType):Promise<void>
    getBudgetHistory(input:GetBudgetHistoryType):Promise<BudgetHistory[]>
    updateMarkUp(input:UpdateMarkUp):Promise<void>
    updateBonus(input:UpdateBonus):Promise<void>
}