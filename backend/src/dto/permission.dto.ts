import { IsInt, Min, IsString, IsIn } from 'class-validator';

export class ChangePermissionTypeRequest {

    @IsInt()
    @Min(0, { message: 'positionId must be greater than or equal to 1' })
    positionId: number;

    @IsInt()
    @Min(0, { message: 'permissionId must be greater than or equal to 1' })
    permissionId: number;

    @IsString()
    @IsIn(['add', 'delete'], { message: 'type must be either "add" or "delete"' })
    type: string;
}
