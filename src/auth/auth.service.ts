import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const passwordMatch = await this.comparePasswords(
      pass,
      user.password, // User's stored hashed password from the database
    );
    if (!passwordMatch) {
      throw new UnauthorizedException(`Could not find credentials`);
    }
    const payload = { username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: username,
    };
  }

  async comparePasswords(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const passwordMatch = await bcrypt.compare(
        enteredPassword,
        hashedPassword,
      );
      return passwordMatch;
    } catch (error) {
      throw error;
    }
  }
}
