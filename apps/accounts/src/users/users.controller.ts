import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccessUserGuard } from '../auth/guards/access-user.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, AccessUserGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  @ApiResponse({
    status: 200,
    description: 'Returns user object without password',
  })
  findOneById(@Param('userId') userId: string) {
    return this.usersService.findOneById(userId);
  }

  @Patch(':userId')
  @ApiResponse({
    status: 200,
    description: 'Updates the user',
  })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Deletes the user',
  })
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
}
