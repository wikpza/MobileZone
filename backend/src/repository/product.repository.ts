import {IProductRepository} from "../interface/ProductRepository.interface";
import {
    CreateProductType,
    DeleteProductType, GetProductSaleHistoryType,
    GetProductsType,
    GetProductType, SaleProductType,
    UpdateProductType
} from "../models/product.model";
import {
    Budget, BudgetHistory,
    Employee,
    Ingredient,
    Product,
    ProductManufacturing,
    ProductSale,
    RawMaterial,
    RawMaterialPurchase,
    Unit
} from "../database/models";
import {AuthorizeError, BaseError, ConflictError, NotFoundError} from "../utils/error";
import {Error, Op, QueryTypes} from "sequelize";
import sequelize from "../database";
import {checkSQLErrorMessage} from "../utils/errors";

export class ProductRepository implements IProductRepository {
    async createProduct(data: CreateProductType): Promise<void> {
        // const unitIdExist = await Unit.findOne({where:{id:data.unitId}})
        // if(!unitIdExist) throw new NotFoundError("Не удалось найти Единицу измерения", {unitId:["Не удалось найти Единицу измерения"]})
        //
        // const productExist = await Product.findOne({where:{name:data.name}})
        // if(productExist) throw new ConflictError("Данное название уже занято", {name:["Данное название уже занято"]})
        //
        // return await Product.create(
        //     {
        //         name:data.name,
        //         unitId:unitIdExist.id,
        //     }
        // )

        try {
            await sequelize.query(
                "EXEC CreateProduct @name = :name, @unitId = :unitId",
                {
                    replacements: {
                        unitId:data.unitId,
                        name: data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры CreateProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }

    async deleteProduct(data: DeleteProductType): Promise<void> {
        // const productExist = await Product.findOne({where:{id:data.id}})
        // if(!productExist) throw new NotFoundError("not found product", {'id':"not found product"})
        //
        // const ingredientExist = await Ingredient.findOne({where:{productId:data.id}})
        // if(ingredientExist) throw new ConflictError('unable to delete, because it consists in ingredients', {"id":"unable to delete, because it consists in ingredients"})
        //
        // const productSales = await ProductSale.findOne({where:{productId:data.id}})
        // if(productSales) throw new ConflictError('unable to delete, because it consists in products sales ', {"id":"unable to delete, because it consists in  products sales"})
        //
        // const productManufacturing = await ProductManufacturing.findOne({where:{productId:data.id}})
        // if(productManufacturing) throw new ConflictError('unable to delete, because it consists in product Manufacturing  ', {"id":"unable to delete, because it consists in  product Manufacturing"})
        //
        //
        // const deleteProduct = await Product.destroy({where:{id:data.id}})
        // if(deleteProduct === 0 )  throw new NotFoundError("Unable to find product", {name:["Unable to find product"]})
        //
        // return productExist

        try {
            await sequelize.query(
                "EXEC DeleteProduct @id = :id",
                {
                    replacements: {
                        id: data.id
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeleteProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }

    getProduct(data: GetProductType): Promise<Product> {
        return Promise.resolve({} as Product);
    }

    async getProducts(data: GetProductsType): Promise<Product[]> {
        const offset = (data.page - 1) * data.limit; // Вычисляем отступ для пагинации

        return await Product.findAll({
            where: data.searchName
                ? { name: { [Op.iLike]: `%${data.searchName}%` } }
                : {},
            limit: data.limit, // Количество записей на странице
            include: [{ model: Unit, attributes: ["id", "name"] }],
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "ASC"]], // Сортировка (по переданному полю)
        });
    }

    async updateProduct(data: UpdateProductType): Promise<void> {
        // const productExist = await Product.findOne({where:{id:data.id}})
        // if(!productExist) throw new ConflictError("Unable to find product", {name:["Unable to product"]})
        //
        // const productExistName = await Product.findOne({where:{name:data.name}})
        // if(productExistName && (productExistName.id !== productExist.id)) throw new ConflictError("Product with such name has already existed", {name:["Product with such name has already existed"]})
        //
        //
        // const unitExist = await Unit.findOne({where:{id:data.unitId}})
        // if(!unitExist) throw new NotFoundError("not found unit", {unitId:["not found unit"]})
        //
        //
        // const [update] = await Product.update({name:data.name, unitId:data.unitId}, {where:{id:data.id}})
        // if(update === 0) throw new NotFoundError("Unable to find product", {name:["Unable to find product"]})
        //
        // return productExist

        try {
            await sequelize.query(
                "EXEC UpdateProduct @id = :id, @name = :name, @unitId = :unitId",
                {
                    replacements: {
                        id: data.id,
                        name:data.name,
                        unitId:data.unitId
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }



    async saleProduct(input: SaleProductType): Promise<void> {

        // const employeeExist = await Employee.findOne({where:{id:input.employeeId}})
        // if(!employeeExist) throw new AuthorizeError('not auth')
        //
        // const productExist = await Product.findOne({where:{id:input.productId}})
        // if(!productExist) throw new NotFoundError('not found product', {productId:['not found product']})
        //
        // if(productExist.quantity < input.quantity) throw new ConflictError('not enough product', {quantity:['not enough product']})
        // if(productExist.cost === 0 || productExist.cost < 0.01) throw new ConflictError('product cost is 0', {quantity:['product cost is 0']})
        //
        // const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //      await Budget.create()
        //     throw new ConflictError('set mark up before selling', {quantity:['set mark up before selling']})
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {quantity:["Unable to get Budget: error in system"]})
        // }
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {quantity:['not found budget']})
        //
        // if(budgetExist.markUp <= 0)  throw new ConflictError('set mark up before selling', {quantity:['set mark up before selling']})



        try {
            await sequelize.query(
                "EXEC saleProduct @p_employeeId = :employeeId, @p_productId = :productId, @p_quantity = :quantity",
                {
                    replacements: {
                        employeeId: input.employeeId,
                        productId: input.productId,
                        quantity: input.quantity
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры saleProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }

    }

    async getProductSaleHistory(input: GetProductSaleHistoryType): Promise<ProductSale[]> {
        const offset = (input.page - 1) * input.limit;
        return await ProductSale.findAll(
            {
                limit: input.limit, // Количество записей на странице
                offset: offset, // Пропускаем записи для пагинации
                order: [[input.sortBy, "DESC"]], // Сортировка (по переданному полю)
                include: [
                    {
                        model: Product,
                        attributes: ["id", "name", "unitId"],
                        include: [
                            {
                                model: Unit,
                                attributes: ["id", "name"],
                            }
                        ]
                    },
                    {
                        model:Employee,
                        attributes:["id", "firstName", "lastName","middleName"]
                    }
                ]
            }
        );
    }

}