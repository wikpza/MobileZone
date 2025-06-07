import { TokenEmployee } from "../../models/employee.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {Employee, Permissions, PositionPermissions} from "../../database/models";
import {AuthorizeError, NotFoundError} from "../../utils/error";
import {Op} from "sequelize";

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: TokenEmployee;
}

export const checkPermission = async (accessPermission: string[], employeeId: number): Promise<void> => {
    if (!accessPermission || accessPermission.length === 0) {
        throw new AuthorizeError("No permissions required", { employeeId: ["No permissions specified"] });
    }

    if (!accessPermission || accessPermission.length === 0) {
        throw new AuthorizeError("No permissions required", { employeeId: ["No permissions specified"] });
    }

    const employee = await Employee.findOne({
        where: { id: employeeId },
        attributes: ['positionId'], // Запрашиваем только нужное поле
        rejectOnEmpty: new NotFoundError('Employee not found', { employeeId: ["Employee not found"] })
    });

    // Проверяем все разрешения одним запросом
    const permissionsCount = await PositionPermissions.count({
        where: {
            positionId: employee.positionId
        },
        include: [{
            model: Permissions,
            where: {
                permissionKey: {
                    [Op.in]: accessPermission
                }
            },
            attributes: [], // Не выбираем данные, только для фильтрации
            required: true // INNER JOIN
        }]
    });

    if (permissionsCount === 0) {
        throw new AuthorizeError("Access denied", {
            employeeId: ["Employee doesn't have required permissions"],
            missingPermissions: accessPermission
        });
    }
};
export const checkTokenJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next(); // If the method is OPTIONS, we stop execution and call next().
    }

    const authHeader = (req.headers as Record<string, string | undefined>).authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as TokenEmployee;
        req.user = {
            id: decoded.id,
            lastName: decoded.lastName,
            firstName: decoded.firstName,
            middleName: decoded.middleName,
            login: decoded.login,
            phone: decoded.phone,
        } as TokenEmployee;
        next();
    } catch (error) {
        console.error("Authentication error:", error); // Log the error
        res.status(401).json({ message: "Not authorized" });
    }
};

