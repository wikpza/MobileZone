import {
    CreateProductType,
    DeleteProductType, GetProductSaleHistoryType,
    GetProductsType,
    GetProductType, SaleProductType,
    UpdateProductType
} from "../models/product.model";
import {Product, ProductSale} from "../database/models";

export interface IProductRepository {
    createProduct(data:CreateProductType):Promise<void>
    updateProduct(data:UpdateProductType):Promise<void>
    deleteProduct(data:DeleteProductType):Promise<void>
    getProducts(data:GetProductsType):Promise<Product[]>
    getProduct(data:GetProductType):Promise<Product>
    saleProduct(input:SaleProductType):Promise<void>
    getProductSaleHistory(input:GetProductSaleHistoryType):Promise<ProductSale[]>
}