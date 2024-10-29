import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}   
