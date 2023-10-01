import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) {
      throw new HttpException(
        `Username already in use`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const existingUserEmail = await this.usersService.findOne(user.email);
    if (existingUserEmail) {
      throw new HttpException(`Email already in use`, HttpStatus.BAD_REQUEST);
    }

    const createdUser = await this.usersService.createUser(user);
    return createdUser;
  }
}
