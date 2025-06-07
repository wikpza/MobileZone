import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {ProductRepository} from "../repository/product.repository";
import {CreateProductRequest, SaleProductRequest, UpdateProductRequest} from "../dto/product.dto";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";

const router = express.Router()
const productRepository = new ProductRepository()

router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["product_work"], req.user?.id)

        const {errors, input} = await RequestValidator(
            CreateProductRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))
        await productRepository.createProduct(
            {
                name:req.body.name,
                unitId:req.body.unitId
            }
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
        await checkPermission(["product_list", "product_work", "product_manufacturing_instruction_list", "product_manufacturing_instruction_work", "product_manufacturing_work", "product_sale_work"], req.user?.id)

        const {page, limit, searchName, sortBy } = req.query;

        const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
        const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)


        const position = await productRepository.getProducts(
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

router.patch("/:id",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try{
        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission(["product_work"], req.user?.id)
        const {errors, input} = await RequestValidator(
            UpdateProductRequest,
            req.body
        )
        if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))

        const id =  parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({ message: "Id должно быть числом",
                details:{id:["Id должно быть числом"]}});
        }

        await productRepository.updateProduct({name:req.body.name, id:id, unitId:req.body.unitId})

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
        await checkPermission(["product_work"], req.user?.id)

        const id =  parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format",
                details:{id:["Invalid ID format"]}});
        }
        await productRepository.deleteProduct({id:id})

        return res.status(201).json({message:"success"})
    }catch(error){
        const err = error as BaseError
        logger.error(err)
        return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
    }
})

router.get("/sale/history",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{

            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["product_sale_list", "product_sale_work"], req.user?.id)

            const {page, limit, sortBy } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)

            const budget = await productRepository.getProductSaleHistory(
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

router.post("/sale",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission([ "product_sale_work"], req.user?.id)

            const {errors, input} = await RequestValidator(
                SaleProductRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            // await checkPermission([4], .body.employeeId)
            await productRepository.saleProduct(
                {
                    employeeId:req.user.id,
                    quantity:req.body.quantity,
                    productId:req.body.productId
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

