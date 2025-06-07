import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {PositionRepository} from "../repository/position.repository";
import {CreatePositionRequest, UpdatePositionRequest} from "../dto/position.dto";
import {PermissionRepository} from "../repository/permission.repository";
import {UpdateUnitRequest} from "../dto/unit.dto";
import {ChangePermissionTypeRequest} from "../dto/permission.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const permissionRepository = new PermissionRepository()

router.get("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["permission_list", 'permission_work'], req.user?.id)
        const permissions = await permissionRepository.getPermissions({})
        return res.status(201).json(permissions)
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.get("/:position",  async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {position} = req.params;

        const positionId = position ? parseInt(position as string, 10) : 1;


        const permissions = await permissionRepository.getPositionPermission(
            {
                positionId:positionId
            }
        )
        return res.status(201).json(permissions)
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
        await checkPermission(['permission_work'], req.user?.id)

        const {errors, input} = await RequestValidator(
            ChangePermissionTypeRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))
         await permissionRepository.changePermissionStatus({type:req.body.type, positionId:req.body.positionId, permissionId:req.body.permissionId})
        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})


export default router