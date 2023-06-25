import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { EncryptPasswordMiddleware } from './interceptors/auth.interceptor';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() { email, password }: LoginDto) {
    return this.authService.signIn(email, password);
  }

  @UseInterceptors(EncryptPasswordMiddleware)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() { email, password }: SignUpDto) {
    return this.authService.signUp(email, password);
  }
}
