import {IUnitRepository} from "../interface/UnitRepository.interface";
import {CreateUnitType, DeleteUnitType, GetUnitsType, GetUnitType, UpdateUnitType} from "../models/unit.model";
import {Position, RawMaterial, Unit} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import {Error, Op, QueryTypes} from "sequelize";
import {raw} from "express";
import sequelize from "../database";
import {transformSalaryData} from "../utils";
import {checkSQLErrorMessage} from "../utils/errors";

export class UnitRepository implements IUnitRepository{
    async createUnit(data: CreateUnitType):Promise<void> {
        // const unitExist = await Unit.findOne({where:{name:data.name}})
        // if(unitExist) throw new ConflictError("Unit with such name has been already added", {name:["Unit with such name has been already added"]})
        // return await Unit.create({name:data.name})

        try {
            await sequelize.query(
                "EXEC CreateUnit @name = :name",
                {
                    replacements: {
                        name: data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры CreateUnit:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }
    }

    async deleteUnit(data: DeleteUnitType): Promise<void> {
        // const unitExist = await Unit.findOne({where:{id:data.id}})
        // if(!unitExist) throw new NotFoundError("Unable to find unit", {name:["Unable to find unit"]})
        //
        // const rawMaterialExist = await RawMaterial.findOne({where:{unitId:data.id}})
        // if(rawMaterialExist) throw new ConflictError("Unable to delete",{id:["unable delete, because you have raw material with such unit"]})
        //
        // const deletedUnit = await Unit.destroy({where:{id:data.id}})
        // if(deletedUnit === 0 )  throw new NotFoundError("Unable to find unit", {name:["Unable to find unit"]})
        //
        // return unitExist

        try {
            await sequelize.query(
                "EXEC DeleteUnit @id = :id",
                {
                    replacements: {
                        id: data.id
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeleteUnit:", error.message);

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

    getUnit(data: GetUnitType): Promise<Unit> {
        return Promise.resolve({} as Unit);
    }

    async getUnits(data: GetUnitsType): Promise<Unit[]> {
        const offset = (data.page - 1) * data.limit; // Вычисляем отступ для пагинации

        return await Unit.findAll({
            where: data.searchName
                ? { name: { [Op.iLike]: `%${data.searchName}%` } }
                : {},
            limit: data.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "ASC"]], // Сортировка (по переданному полю)
        });

    }

    async updateUnit(data: UpdateUnitType): Promise<void> {
        // const unitExist = await Unit.findOne({where:{id:data.id}})
        // if(!unitExist) throw new NotFoundError("Unable to find unit", {name:["Unable to find unit"]})
        //
        // const unitExistName = await Unit.findOne({where:{name:data.name}})
        // if(unitExistName) throw new ConflictError("Unit with such name has been already added", {name:["Unit with such name has been already added"]})
        //
        //
        // const [updatedUnit] = await Unit.update({name:data.name}, {where:{id:unitExist.id}})
        // if(updatedUnit === 0) throw new NotFoundError("Unable to find unit", {name:["Unable to find unit"]})
        //
        // return  unitExist

        try {
            await sequelize.query(
                "EXEC UpdateUnit @id = :id, @name = :name",
                {
                    replacements: {
                        id: data.id,
                        name: data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateUnit:", error.message);

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