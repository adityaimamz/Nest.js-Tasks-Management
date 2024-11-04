// auth.controller.ts

import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Response } from 'express'; 
import { successResponse } from '../helpers/response.utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.authService.signUp(authCredentialsDto);
    return res.status(HttpStatus.CREATED).json(
      successResponse('Signup berhasil', {})
    );
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<Response> {
    const accessToken = await this.authService.signIn(authCredentialsDto); 
    return res.status(HttpStatus.OK).json(
      successResponse('Signin berhasil', { accessToken })
    );
  }
}
