import {IPositionRepository} from "../interface/PositionRepository.interface";
import {
    CreatePositionType,
    DeletePositionType,
    GetPositionsType,
    GetPositionType,
    UpdatePositionType
} from "../models/postion.model";
import {Employee, Position, PositionPermissions} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import sequelize from "../database";
import {Error, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";

export class PositionRepository implements IPositionRepository{
    async createPosition(data: CreatePositionType): Promise<void> {
        // const positionExist = await Position.findOne({where:{name:data.name}})
        // if(positionExist) throw new ConflictError("position with such name has already existed", {name:["position with such name has already existed"]})
        // return await Position.create({name:data.name})

        try {
            const result = await sequelize.query(
                "EXEC CreatePosition @name = :name",
                {
                    replacements: {
                        name: data.name
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры CreatePosition:", error.message);

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

    async deletePosition(data: DeletePositionType): Promise<void> {
        const positionExist = await Position.findOne({where:{id:data.id}})
        // if(!positionExist) throw new NotFoundError("not found position", {id:["not found position"]})
        //
        // const employeeExist = await Employee.findOne({where:{positionId:data.id}})
        // if(employeeExist) throw new ConflictError("can not delete, because it references in employee", {id:["can not delete, because it references in employee"]})
        //
        // await PositionPermissions.destroy({where:{positionId:data.id}})
        // const number = await Position.destroy({where:{id:data.id}})
        //
        // if(number === 0 ) throw new ConflictError("unable to delete position", {name:["unable to delete position"]})
        // return positionExist

        try {
             await sequelize.query(
                "EXEC DeletePosition @id = :id",
                {
                    replacements: {
                        id: data.id
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeletePosition:", error.message);

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

            throw new BaseError("Internal SQL error", 500,"Internal SQL error",error )

        }
    }

    async getPosition(data: GetPositionType): Promise<Position> {
        return Promise.resolve({} as Position);
    }

    async getPositions(data: GetPositionsType): Promise<Position[]> {
        const offset = (data.page - 1) * data.limit;
        return await Position.findAll({
            limit: data.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "DESC"]], // Сортировка (по переданному полю)
        });
    }

    async updatePosition(data: UpdatePositionType): Promise<void> {
        // const positionExist = await Position.findOne({where:{id:data.id}})
        // if(!positionExist) throw new NotFoundError("not found position", {id:["not found position"]})
        //
        // const positionNameExist = await Position.findOne({where:{name:data.name}})
        // if(positionNameExist) throw new ConflictError("position with such name has already existed", {name:["position with such name has already existed"]})
        //
        // positionExist.name = data.name
        // await positionExist.save()
        // return positionExist

        try {
            const result = await sequelize.query(
                "EXEC UpdatePosition @name = :name, @id = :id",
                {
                    replacements: {
                        name: data.name,
                        id: data.id
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdatePosition:", error.message);

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
}
