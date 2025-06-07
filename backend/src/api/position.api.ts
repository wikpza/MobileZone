import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {PositionRepository} from "../repository/position.repository";
import {CreatePositionRequest, UpdatePositionRequest} from "../dto/position.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const positionRepository = new PositionRepository()

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["position_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            CreatePositionRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)
        await positionRepository.createPosition(req.body)

        return res.status(201).json({message:"created"})
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
        await checkPermission(["position_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            UpdatePositionRequest,
            req.body
        )
        if(errors) return res.status(400).json(errors)

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
            details:{id:["Invalid ID format"]}});
        }

        await positionRepository.updatePosition({name:req.body.name, id:id})

        return res.status(201).json({message:"updated"})
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
        await checkPermission(["position_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
        await positionRepository.deletePosition({id:id})

        return res.status(201).json({message:"deleted"})
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
        await checkPermission(["position_work", "position_list", "employee_work", 'permission_list', 'permission_work'], req.user?.id)

        const {page, limit, searchName, sortBy } = req.query;

        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 10;  // Лимит (по умолчанию 10)


        const position = await positionRepository.getPositions(
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
//
// router.get("/:id",  async (req:Request, res:Response, next:NextFunction)=>{
//     try{
//         const id =  parseInt(req.params.id)
//
//
//         if (isNaN(id)) {
//             return res.status(400).json({ message: "Invalid ID format",
//                 details:{id:["Invalid ID format"]}});
//         }
//         const position = await positionRepository.getPosition(
//             {
//              id
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