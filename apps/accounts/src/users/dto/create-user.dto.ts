import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user_11@example.com',
    required: true,
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long.',
  })
  @IsNotEmpty()
  @ApiProperty({
    example: '123123',
    required: true,
    description: 'The password of the user',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'User name',
  })
  name: string;
}
