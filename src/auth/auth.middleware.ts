// auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { Response, NextFunction } from 'express-serve-static-core';
import * as passport from 'passport';
import { UsersService } from '../users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {
    // Define your Passport strategy for JWT authentication
    passport.use(
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: jwtConstants.secret, // Replace with your actual secret key
        },
        async (payload, done) => {
          // You can perform additional validation here, e.g., checking if the user exists
          // If the token is valid, call `done(null, payload)`; if not, call `done(err)`
          try {
            // You may want to use a database query to check if the user exists
            const user = await this.usersService.findOne(payload.username); // Replace with your actual database query

            if (!user) {
              // If the user does not exist, call `done` with an error
              return done(null, false, { message: 'User not found' });
            }

            // If the token is valid and the user exists, call `done` with the user object
            done(null, user);
          } catch (err) {
            // If an error occurs during the validation process, call `done` with the error
            done(err);
          }
        },
      ),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Use Passport to authenticate the request using the JWT strategy
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        // Unauthorized: Token is invalid or missing
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Authentication successful, store the user in the request object
      req.user = user; // The user object is already available as req.user
      next();
    })(req, res, next);
  }
}
