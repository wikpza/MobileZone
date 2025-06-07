import express, {NextFunction, Response, Request} from "express";
import {PurchaseRepository} from "../repository/purchase.repository";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {RequestValidator} from "../utils/requestValidator";
import {IncomeBudgetRequest} from "../dto/budget.dto";
import {MakePurchaseRequest} from "../dto/purchase.dto";

const router = express.Router()
const purchaseRepository = new PurchaseRepository()

router.get("/history",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{

            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["raw_material_procurement_list", "raw_material_procurement_work"], req.user?.id)

            const { page, limit, sortBy, beforeDate, toDate } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)

            const parsedBeforeDate = beforeDate ? new Date(beforeDate as string) : undefined;
            const parsedToDate = toDate ? new Date(toDate as string) : undefined;

            // Валидация дат
            if (parsedBeforeDate && isNaN(parsedBeforeDate.getTime())) {
                return res.status(400).json({ message: "Invalid beforeDate format" });
            }
            if (parsedToDate && isNaN(parsedToDate.getTime())) {
                return res.status(400).json({ message: "Invalid toDate format" });
            }
            if (parsedBeforeDate && parsedToDate && parsedBeforeDate > parsedToDate) {
                return res.status(400).json({ message: "beforeDate cannot be after toDate" });
            }

            const purchases = await purchaseRepository.getPurchases(
                {
                    page:parsedPage,
                    limit:parsedLimit,
                    sortBy: sortBy? sortBy as string : 'createdAt',
                    beforeDate:parsedBeforeDate,
                    toDate: parsedToDate
                }
            )
            return res.status(201).json(purchases)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission([ "raw_material_procurement_work"], req.user?.id)


            const {errors, input} = await RequestValidator(
                MakePurchaseRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))
            // await checkPermission([2], req.body.employeeId)
            await purchaseRepository.makePurchases(
                {
                    rawMaterialId:req.body.materialId,
                    employerId:req.user.id,
                    quantity:req.body.quantity,
                    cost:req.body.cost,
                }
            )

            return res.status(201).json({message:"success"})

        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })



export default router