import { IsOptional } from "class-validator";
import { IsString } from "class-validator";
import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
    @IsOptional()
    @IsString()
    search?: string;
}
