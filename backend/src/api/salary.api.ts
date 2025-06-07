import express, {NextFunction, Request, Response} from "express";
import {SalaryRepository} from "../repository/salary.repository";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError, NotFoundError} from "../utils/error";
import {logger} from "../utils/logger";
import {
    ChangeSalaryRequest,
    ChangeSalaryStatusRequest,
    GenerateSalaryListRequest,
    GiveSalaryRequest
} from "../dto/salary.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const salaryRepository = new SalaryRepository()

router.patch("/status/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["salary_change"], req.user?.id)

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

        const {errors, input} = await RequestValidator(
            ChangeSalaryStatusRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        // await checkPermission([5], req.body.employeeId)

        await salaryRepository.changeStatus(
            {id:id, employeeId:req.user.id}
        )

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.patch("/status/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["salary_give"], req.user?.id)
        const {errors, input} = await RequestValidator(
            GiveSalaryRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)

        // await checkPermission([5], req.body.employeeId)

        await salaryRepository.giveSalary(
            { year:req.body.year, month:req.body.month, employeeId:req.user.id}
        )

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.patch("/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["salary_change"], req.user?.id)


        const {errors, input} = await RequestValidator(
            ChangeSalaryRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

        await salaryRepository.changeSalary(
            {id, salary:req.body.salary}
        )

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
        await checkPermission(["salary_list_report", "salary_change", "salary_give"], req.user?.id)

        const {page, limit, sortBy, month, year } = req.query;

        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)

        if(!month) throw new NotFoundError('not found month',{month:['not found month']})
        if(!year) throw new NotFoundError('not found year',{year:['not found year']})

        const parsedMonth = parseInt(month as string, 10)
        const parsedYear =  parseInt(year as string, 10)

        const position = await salaryRepository.getSalaryList(
            {
                month:parsedMonth,
                year:parsedYear,
                page:parsedPage,
                limit:parsedLimit,
                sortBy: sortBy? sortBy as string : 'createdAt'
            }
        )
        return res.status(201).json(position)
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.post("/generate",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["salary_list_report", "salary_change", "salary_give"], req.user?.id)


        const {errors, input} = await RequestValidator(
            GenerateSalaryListRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)

        const position = await salaryRepository.generateSalaryList(
            {
                month:req.body.month,
                year:req.body.year,
            }
        )
        return res.status(201).json(position)
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})
export default router