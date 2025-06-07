import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {CreatePositionRequest, UpdatePositionRequest} from "../dto/position.dto";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {UnitRepository} from "../repository/unit.repository";
import {CreateUnitRequest, UpdateUnitRequest} from "../dto/unit.dto";
import {Unit} from "../database/models";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const unitRepository = new UnitRepository()

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{

        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["unit_work"], req.user?.id)
        const {errors, input} = await RequestValidator(
            CreateUnitRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)


        await unitRepository.createUnit(req.body)

        return res.status(201).json({message:"Unit successfully created"})
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
        await checkPermission(["unit_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            UpdateUnitRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

        await unitRepository.updateUnit({name:req.body.name, id:id})

        return res.status(201).json({message:"unit successfully updated"})
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
        await checkPermission(["unit_work"], req.user?.id)


        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
         await unitRepository.deleteUnit({id:id})

        return res.status(201).json({message:"successfully deleted"})
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
        await checkPermission(["unit_list", 'unit_work', "raw_material_work", "product_work"], req.user?.id)
        const {page, limit, searchName, sortBy } = req.query;
        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)
        const position = await unitRepository.getUnits(
            {
                page:parsedPage,
                limit:parsedLimit,
                sortBy: sortBy? sortBy as string : 'name'
            }
        )
        return res.status(201).json(position)
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

// router.get("/admin",  async (req:Request, res:Response, next:NextFunction)=>{
//     try{
//         const position =  await Unit.findAll();
//         return res.status(201).json(position)
//     }catch(error){
//         const err = error as BaseError
//         logger.error(err)
//         return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
//     }
// })

// router.get("/:id",  async (req:Request, res:Response, next:NextFunction)=>{
//     try{
//         const id =  parseInt(req.params.id)
//         if (isNaN(id)) {
//             return res.status(400).json({ message: "Invalid ID format",
//                 details:{id:["Invalid ID format"]}});
//         }
//         const position = await unitRepository.getUnit(
//             {
//                 id:id
//             }
//         )
//         return res.status(201).json(position)
//     }catch(error){
//         const err = error as BaseError
//         logger.error(err)
//         return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
//     }
// })



export default router