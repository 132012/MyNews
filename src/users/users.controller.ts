import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Put,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SavedArticleDocument, User } from './users.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
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

  @Put('save')
  @UseGuards(AuthGuard)
  async updateData(
    @Req() request: Request,
    @Body() addArticleDto: SavedArticleDocument,
  ) {
    return this.usersService.addArticle(
      request['user'].username,
      addArticleDto,
    );
  }

  @Put('delete')
  @UseGuards(AuthGuard)
  async deleteData(@Req() request: Request, @Body() articleId: any) {
    console.log(articleId);
    return this.usersService.deleteArticle(
      request['user'].username,
      articleId.articleId,
    );
  }

  @Get('saved')
  @UseGuards(AuthGuard)
  async getSavedArticles(@Req() request: Request) {
    return this.usersService.getUserArticles(request['user'].username);
  }
}
