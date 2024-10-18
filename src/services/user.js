import error from '../middlewares/error.js';
import { logger } from '../loaders/pino.js';
import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';

/** @import {ValidUserPayload} from '../middlewares/validation/user.js' */

export class UserService {
  /** @param {string} id */
  static async getUser(id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        profile: true,
        account: true
      }
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return user;
  }

  static async getUsers() {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        account: true
      }
    });

    return users;
  }

  /** @param {ValidUserPayload} user */
  static async createUser(user) {
    user.password = await AuthService.hashPassword(user.password);

    const { address, identityType, identityNumber, ...restUser } = user;

    const data = await prisma.user.create({
      data: {
        ...restUser,
        profile: {
          create: {
            address,
            identityType,
            identityNumber
          }
        }
      }
    });

    return data;
  }
}
