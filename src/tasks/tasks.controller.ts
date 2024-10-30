import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Response } from 'express';
import { successResponse } from '../helpers/response.utils';
import { GetUser } from '../auth/get-user.decorator'; // Import decorator
import { User } from '../auth/user.entity'; // Import User entity
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User, // Ambil user dari request
    @Res() res: Response,
  ): Promise<Response> {
    const tasks = await this.tasksService.getTasks(filterDto, user);
    return res.status(HttpStatus.OK).json(
      successResponse('Tasks retrieved successfully', { tasks })
    );
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User, // Ambil user dari request
    @Res() res: Response,
  ): Promise<Response> {
    const task = await this.tasksService.getTaskById(id, user);
    return res.status(HttpStatus.OK).json(
      successResponse('Task retrieved successfully', { task })
    );
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
    @Res() res: Response,
  ): Promise<Response> {
    const task = await this.tasksService.createTask(createTaskDto, user);
    return res.status(HttpStatus.CREATED).json(
      successResponse('Task created successfully', { task })
    );
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User, // Ambil user dari request
    @Res() res: Response,
  ): Promise<Response> {
    await this.tasksService.deleteTask(id, user);
    return res.status(HttpStatus.OK).json(
      successResponse('Task deleted successfully', {})
    );
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User, // Ambil user dari request
    @Res() res: Response,
  ): Promise<Response> {
    const task = await this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
    return res.status(HttpStatus.OK).json(
      successResponse('Task status updated successfully', { task })
    );
  }
}
