import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'doe@mail.test',
  })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Asecurepassword123!',
  })
  @IsEmpty({ message: 'Password cannot be empty' })
  password: string;
}
