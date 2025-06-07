import express, {NextFunction, Response, Request} from "express";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {RequestValidator} from "../utils/requestValidator";
import {
    CreateEmployeeRequest, DirectorSelectRequest,
    LoginEmployeeRequest,
    UpdateEmployeeDataRequest,
    UpdateEmployeeRequest
} from "../dto/employee.dto";
import {EmployeeRepository} from "../repository/employee.repository";
import {generateJwt} from "../utils";
import { TokenEmployee} from "../models/employee.model";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const employeeRepository = new EmployeeRepository()
//
router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{

        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["employee_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            CreateEmployeeRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        await employeeRepository.createEmployee(req.body)

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})
//
router.post('/login', async(req:Request, res:Response, next:NextFunction)=>{
    try{
        console.log("work")
        // const {errors, input} = await RequestValidator(
        //     CreateEmployeeRequest,
        //     req.body
        // )
        // if(errors) return res.status(400).json(errors)
        const employee = await employeeRepository.login(req.body)
        const token =  generateJwt(
            {
                id:employee.id,
                firstName:employee.firstName,
                lastName:employee.lastName,
                middleName:employee.middleName,
                login:employee.login,
               phone:employee.phone, employee
            } as TokenEmployee)
        console.log(token)
        return res.status(201).json({token})
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
        await checkPermission(["employee_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            UpdateEmployeeRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

    await employeeRepository.updateEmployee(
            {id, ...req.body}
        )

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.patch("/data/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{

            const id =  parseInt(req.params.id)

            if (isNaN(id)) {
                return res.status(400).json({ message: "Id должно быть числом",
                    details:{id:["Id должно быть числом"]}});
            }

            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }

            if(req.user.id !== id ){
                await checkPermission(["employee_work"], req.user?.id)
            }

            const {errors, input} = await RequestValidator(
                UpdateEmployeeDataRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))


            await employeeRepository.updateEmployeeData(
                {id, ...req.body}
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
        await checkPermission(["employee_list", "employee_work"], req.user?.id)

        const {page, limit, searchName, sortBy } = req.query;

        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)


        const position = await employeeRepository.getEmployeeList(
            {
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

router.delete("/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["employee_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
         await employeeRepository.deleteEmployee({id:id})

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})


router.get("/data",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }

            const position = await employeeRepository.getEmployeeData(
                {
                  id:req.user.id
                }
            )
            return res.status(201).json(position)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.get("/static/:id",
    // checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            // if(!req.user || !req.user.id){
            //     return res.status(403).json("access denied")
            // }

            const id =  parseInt(req.params.id)
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid ID format",
                    details:{id:["Invalid ID format"]}});
            }

            const position = await employeeRepository.getEmployeeStatistic(
                {
                    id
                }
            )
            return res.status(201).json(position)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.get("/director",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            // await checkPermission(["employee_list"], req.user?.id)


            const position = await employeeRepository.getDirector(
            )
            return res.status(201).json(position)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

router.post('/director',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["director_select"], req.user?.id)

        const {errors, input} = await RequestValidator(
            DirectorSelectRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)


        const employee = await employeeRepository.setDirector({employeeId:req.body.employeeId})
        const token =  generateJwt(
            {
                id:employee.id,
                firstName:employee.firstName,
                lastName:employee.lastName,
                middleName:employee.middleName,
                login:employee.login,
                phone:employee.phone, employee
            } as TokenEmployee)
        console.log(token)
        return res.status(201).json({token})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }

})

export default router