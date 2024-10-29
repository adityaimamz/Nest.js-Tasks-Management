import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TasksRepository]), AuthModule],
  providers: [TasksService, TasksRepository],
  controllers: [TasksController],
  exports: [TasksRepository],
})
export class TasksModule {}
