import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { appEnv } from '../utils/env.js';
import { HttpError } from '../utils/error.js';
import { prisma } from '../utils/db.js';

/** @import {ValidLoginPayload} from '../middlewares/validation/auth.js' */

export class AuthService {
  /** @param {ValidLoginPayload} payload */
  static async login(payload) {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw new HttpError(
        401,
        'Email or password is incorrect, please try again'
      );
    }

    const isMatch = await this.isPasswordMatch(password, user.password);

    if (!isMatch) {
      throw new HttpError(
        401,
        'Email or password is incorrect, please try again'
      );
    }

    const token = await this.generateToken(user.id);

    const userWithToken = {
      ...user,
      token
    };

    return userWithToken;
  }

  /**
   * @param {string} password
   * @param {number} salt
   */
  static async hashPassword(password, salt = 10) {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   */
  static async isPasswordMatch(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }

  /** @param {string} id */
  static async generateToken(id) {
    const token = jwt.sign({ id }, appEnv.JWT_SECRET, {
      expiresIn: '1d'
    });

    return token;
  }

  /** @param {string} token */
  static async verifyToken(token) {
    try {
      const decodedToken = jwt.verify(token, appEnv.JWT_SECRET);

      const validToken = typeof decodedToken === 'object' && decodedToken.id;

      if (!validToken) {
        throw new HttpError(401, 'Invalid token');
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.id
        }
      });

      if (!user) {
        throw new HttpError(401, 'Invalid token');
      }

      return user;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new HttpError(401, 'Invalid token');
      }

      throw err;
    }
  }
}
