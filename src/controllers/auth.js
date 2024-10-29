import { UserService } from '../services/user.js';
import { AuthService } from '../services/auth.js';

/** @import {Request,Response} from 'express' */
/** @import {ValidUserPayload} from '../middlewares/validation/user.js' */

export class AuthController {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} res
   */
  static async login(req, res) {
    const userWithToken = await AuthService.login(req.body);

    res.status(200).json({ data: userWithToken });
  }

  /**
   * @param {Request<unknown, unknown, ValidUserPayload>} req
   * @param {Response} res
   */
  static async register(req, res) {
    const user = await UserService.createUser(req.body);

    res.status(201).json({ data: user });
  }
}
