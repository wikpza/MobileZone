import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {CreatePositionRequest, UpdatePositionRequest} from "../dto/position.dto";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {IngredientRepository} from "../repository/ingredient.repository";
import {AddIngredientRequest, UpdateIngredientRequest} from "../dto/ingredient.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const ingredientRepository = new IngredientRepository()

router.post("/product/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["product_manufacturing_instruction_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        const {errors, input} = await RequestValidator(
            AddIngredientRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))
        await ingredientRepository.addIngredient({productId:id, quantity:req.body.quantity, rawMaterialId:req.body.materialId})

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
        await checkPermission(["product_manufacturing_instruction_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            UpdateIngredientRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }

         await ingredientRepository.updateIngredient(
            {
                quantity:req.body.quantity,
                id:id}
        )

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
        await checkPermission(["product_manufacturing_instruction_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
        await ingredientRepository.deleteIngredient({id:id})

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.get("/product/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["product_manufacturing_instruction_work", "product_manufacturing_instruction_list", "product_manufacturing_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }

        const position = await ingredientRepository.getProductIngredient(
            {
                id:id
            }
        )
        return res.status(201).json(position)
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.get("/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["product_manufacturing_instruction_list", "product_manufacturing_instruction_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
        const position = await ingredientRepository.getIngredient(
            {
                id:id
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