import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SavedArticleDocument, User } from './users.schema';
import { of } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(user: User): Promise<any> {
    const newUser = new this.userModel(user);
    const result = await newUser.save();
    return {
      code: 200,
      message: `User ${result.username} created successfully`,
    };
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async addArticle(
    username: string,
    article: SavedArticleDocument,
  ): Promise<any> {
    const existingUser = await this.findOne(username);

    if (!existingUser) {
      throw new NotFoundException('Data not found');
    }
    existingUser.savedArticles.push(article);
    existingUser.save();
    return of('Succesfully saved article');
  }

  async deleteArticle(username: string, articleId: any): Promise<any> {
    const existingUser = await this.findOne(username);

    if (!existingUser) {
      throw new NotFoundException('Data not found');
    }
    const updatedDocument = await this.userModel.updateOne(
      { _id: existingUser._id },
      { $pull: { savedArticles: { _id: articleId } } },
    );

    if (updatedDocument.modifiedCount > 0) {
      return { success: true, message: 'Object deleted from the array' };
    } else {
      return { success: false, message: 'Object not found or not deleted' };
    }
  }

  async getUserArticles(username: string): Promise<any> {
    const existingUser = await this.findOne(username);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const toReturn = existingUser.savedArticles;
    return Promise.resolve(toReturn);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
