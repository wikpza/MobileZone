import express, {NextFunction, raw, Request, Response} from "express";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {RawMaterialRepository} from "../repository/rawMaterail.repository";
import {RequestValidator} from "../utils/requestValidator";
import {CreateRawMaterialRequest} from "../dto/rawMaterial.dto";
import {UpdateUnitRequest} from "../dto/unit.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()

const rawMaterialRepository = new RawMaterialRepository()

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["raw_material_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            CreateRawMaterialRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        await rawMaterialRepository.createRawMaterial(req.body)

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
            await checkPermission(["raw_material_work", "raw_material_list", "product_manufacturing_instruction_list", "raw_material_procurement_work"], req.user?.id)

            const { page, limit, searchName, sortBy } = req.query;
            const parsedPage = page ? parseInt(page as string, 10) : 1; // По умолчанию 1
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30; // По умолчанию 10
            const parsedSortBy = sortBy ? (sortBy as string) : undefined; // Не задаем значение по умолчанию
            const parsedSearchName = searchName ? (searchName as string) : undefined;

            const rawMaterials = await rawMaterialRepository.getRawMaterials({
                page: parsedPage,
                limit: parsedLimit,
                sortBy: parsedSortBy?parsedSortBy:"createdAt",
                searchName: parsedSearchName,
            });

            return res.status(200).json(rawMaterials);
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
        await checkPermission(["raw_material_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            CreateRawMaterialRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))


        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

       await rawMaterialRepository.updateRawMaterial({name:req.body.name, id:id, unitId:req.body.unitId})

        return res.status(201).json({message:"success"})
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
        await checkPermission(["raw_material_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
        await rawMaterialRepository.deleteRawMaterial({id:id})

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})


export default router