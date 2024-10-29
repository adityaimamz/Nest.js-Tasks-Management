import { Repository, DataSource } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        try {
            const { username, password } = authCredentialsDto;

            const salt = await bcrypt.genSalt();    
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = this.create({ username, password: hashedPassword });
            await this.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

}
