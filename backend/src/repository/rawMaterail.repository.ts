import {IRawMaterialRepository} from "../interface/RawMaterialRepository.interface";
import {
    CreateRawMaterial,
    DeleteRawMaterialType,
    GetRawMaterialsType,
    GetRawMaterialType, UpdateRawMaterialType
} from "../models/rawMaterial.model";
import {Ingredient, RawMaterial, RawMaterialPurchase, Unit} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import {Error, Op, QueryTypes} from "sequelize";
import sequelize from "../database";
import {checkSQLErrorMessage} from "../utils/errors";

export class RawMaterialRepository implements IRawMaterialRepository {
    async createRawMaterial(data: CreateRawMaterial): Promise<void> {
        // const rawMaterialExist = await RawMaterial.findOne({where:{name:data.name}})
        // if(rawMaterialExist) throw new ConflictError("Raw material with such name has already existed", {name:["Raw material with such name has already existed"]})
        //
        // const unitExist = await Unit.findOne({where:{id:data.unitId}})
        // if(!unitExist) throw new NotFoundError("Unable to find unit", {unitId:["Unable to find unit"]})
        //
        // return await RawMaterial.create(
        //     {
        //         name:data.name,
        //         cost:0,
        //         quantity:0,
        //         unitId:unitExist.id
        //     }
        // )

        try {
            await sequelize.query(
                "EXEC CreateRawMaterial @unitId = :unitId, @name = :name",
                {
                    replacements: {
                        unitId: data.unitId,
                        name:data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры CreateRawMaterial:", error.message);

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

    async deleteRawMaterial(data: DeleteRawMaterialType): Promise<void> {
        // const materialExist = await RawMaterial.findOne({where:{id:data.id}})
        // if(!materialExist) throw new NotFoundError("not found material", {'id':"not found material"})
        //
        // const ingredientExist = await Ingredient.findOne({where:{rawMaterialId:data.id}})
        // if(ingredientExist) throw new ConflictError('unable to delete, because it consists in ingredients', {"id":"unable to delete, because it consists in ingredients"})
        //
        // const rawMaterialPurchases = await RawMaterialPurchase.findOne({where:{rawMaterialId:data.id}})
        // if(rawMaterialPurchases) throw new ConflictError('unable to delete, because it consists in ingredients ', {"id":"unable to delete, because it consists in ingredients"})
        //
        // const deletedMaterial = await RawMaterial.destroy({where:{id:data.id}})
        // if(deletedMaterial === 0 )  throw new NotFoundError("Unable to find material", {name:["Unable to find material"]})
        //
        // return materialExist

        try {
            await sequelize.query(
                "EXEC DeleteRawMaterial @id = :id",
                {
                    replacements: {
                        id: data.id,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeleteRawMaterial:", error.message);

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

     getRawMaterial(data: GetRawMaterialType): Promise<RawMaterial> {
        return Promise.resolve({} as RawMaterial);
    }

    async getRawMaterials(data: GetRawMaterialsType): Promise<RawMaterial[]> {
        const offset = (data.page - 1) * data.limit; // Вычисляем отступ для пагинации

        const rawMaterials = await RawMaterial.findAll({
            where: data.searchName
                ? { name: { [Op.iLike]: `%${data.searchName}%` } } // Фильтрация по имени (регистр не учитывается)
                : {},
            include: [{ model: Unit, attributes: ["id", "name"] }], // Подключение единицы измерения
            limit: data.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "ASC"]], // Сортировка (по переданному полю)
        });

        return rawMaterials;
    }

    async updateRawMaterial(data: UpdateRawMaterialType): Promise<void> {
        // const rawMaterialExist = await RawMaterial.findOne({where:{id:data.id}})
        // if(!rawMaterialExist) throw new ConflictError("Unable to find raw material", {name:["Unable to find raw material"]})
        //
        // const rawMaterialExistName = await RawMaterial.findOne({where:{name:data.name}})
        // if(rawMaterialExistName && (rawMaterialExistName.id !== rawMaterialExist.id)) throw new ConflictError("Raw material with such name has already existed", {name:["Raw material with such name has already existed"]})
        //
        //
        // const unitExist = await Unit.findOne({where:{id:data.unitId}})
        // if(!unitExist) throw new NotFoundError("not found unit", {unitId:["not found unit"]})
        //
        //
        // const [updatedUnit] = await RawMaterial.update({name:data.name, unitId:data.unitId}, {where:{id:data.id}})
        // if(updatedUnit === 0) throw new NotFoundError("Unable to find raw material", {name:["Unable to find raw material"]})
        //
        // return rawMaterialExist

        try {
            await sequelize.query(
                "EXEC UpdateRawMaterial @id = :id, @name = :name, @unitId = :unitId",
                {
                    replacements: {
                        id: data.id,
                        unitId:data.unitId,
                        name: data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateRawMaterial:", error.message);

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

}