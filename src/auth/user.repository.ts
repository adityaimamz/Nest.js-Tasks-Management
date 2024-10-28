import { Repository, DataSource } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = this.create({ username, password });
        await this.save(user);
    }
}
