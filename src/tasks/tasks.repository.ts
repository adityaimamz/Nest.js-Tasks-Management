import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TasksRepository {
  private readonly repository: Repository<Task>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Task);
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.repository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async save(task: Task): Promise<Task> {
    return await this.repository.save(task);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.repository.save(task);
    return task;
  }

  async findOneById(id: string): Promise<Task | null> {
    return await this.repository.findOne({ where: { id } });
  }
}
