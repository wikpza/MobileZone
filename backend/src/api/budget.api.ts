import express, {NextFunction, Response, Request} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {BudgetRepository} from "../repository/budget.repository";
import {IncomeBudgetRequest, UpdateBonusRequest, UpdateMarkUpRequest} from "../dto/budget.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const budgetRepository = new BudgetRepository()


router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["budget_work"], req.user?.id)

            const {errors, input} = await RequestValidator(
                IncomeBudgetRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))



            await budgetRepository.incomeBudget({amount:req.body.amount, id:req.user.id})

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.patch("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["budget_work"], req.user?.id)

            const {errors, input} = await RequestValidator(
                UpdateMarkUpRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

            await budgetRepository.updateMarkUp({markUp:req.body.markUp})

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.patch("/bonus",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["budget_work"], req.user?.id)

            const {errors, input} = await RequestValidator(
                UpdateBonusRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))


            await budgetRepository.updateBonus({bonus:req.body.bonus})

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })


router.get("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["budget_info", 'budget_work'], req.user?.id)

            const budget = await budgetRepository.getBudget()
            return res.status(201).json(budget)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
})

router.get("/history",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["budget_info", "budget_work"], req.user?.id)
            const {page, limit, sortBy } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)

            const budget = await budgetRepository.getBudgetHistory(
                {
                    page:parsedPage,
                    limit:parsedLimit,
                    sortBy: sortBy? sortBy as string : 'createdAt'
                }
            )
            return res.status(201).json(budget)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

export default router