import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 7200
      },
    }),
    TypeOrmModule.forFeature([User, UserRepository])],
  providers: [AuthService, JwtStrategy, UserRepository],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
