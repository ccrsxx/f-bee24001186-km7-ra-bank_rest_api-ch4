import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';

/** @import {ValidUserPayload,ValidUserProfilePayload} from '../middlewares/validation/user.js' */

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
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email
      }
    });

    if (existingUser) {
      throw new HttpError(409, 'User already registered');
    }

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
      },
      include: {
        profile: true
      }
    });

    return data;
  }

  /**
   * @param {string} id
   * @param {ValidUserProfilePayload} payload
   */
  static async updateUserProfile(id, payload) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!existingUser) {
      throw new HttpError(404, 'User not found');
    }

    const { image, address, identityNumber, identityType } = payload;

    const data = await prisma.user.update({
      where: {
        id
      },
      data: {
        profile: {
          update: {
            where: {
              userId: id
            },
            data: {
              image,
              address,
              identityType,
              identityNumber
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    return data;
  }
}
