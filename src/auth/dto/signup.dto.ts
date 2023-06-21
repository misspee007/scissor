import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'User email',
    example: 'doe@test.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Asecurepassword123!',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password must be a strong password' },
  )
  password: string;
}
