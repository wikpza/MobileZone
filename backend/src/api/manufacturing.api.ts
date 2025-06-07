import express, {NextFunction, Response} from "express";
import {ManufacturingRepository} from "../repository/manufacturing.repository";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {MakeManufacturingRequest} from "../dto/manufacturing.dto";

const router = express.Router()
const manufacturingRepository = new ManufacturingRepository()

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req?.user?.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["product_manufacturing_work"], req.user?.id)

            const {errors, input} = await RequestValidator(
                MakeManufacturingRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))



            await manufacturingRepository.makeProduct(
                {
                    quantity:req.body.quantity,
                    productId:req.body.productId,
                    employeeId:req.user.id
                }
            )

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.get("/history",
    checkTokenJWT,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(403).json("access denied")
            }
            await checkPermission(["product_manufacturing_work", "product_manufacturing_list"], req.user?.id)

            const { page, limit, sortBy, beforeDate, toDate } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 90;  // Лимит (по умолчанию 90)

            // Парсим даты, если они переданы
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

            const budget = await manufacturingRepository.getManufacturingHistory(
                {
                    page: parsedPage,
                    limit: parsedLimit,
                    sortBy: sortBy ? sortBy as string : 'createdAt',
                    beforeDate: parsedBeforeDate,
                    toDate: parsedToDate
                }
            )
            return res.status(201).json(budget)
        } catch (error) {
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({ message: err.message, details: err.details || {} }, null, 2))
        }
    })

export default router