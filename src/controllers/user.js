import express from 'express';
import { UserService } from '../services/user.js';

/** @import {ValidUserPayload} from '../middlewares/validation/user.js' */

export class UserController {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   */
  static async getUser(req, res) {
    const user = await UserService.getUser(req.params.id);

    res.status(201).json({ data: user });
  }

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  static async getUsers(req, res) {
    const users = await UserService.getUsers();

    res.status(201).json({ data: users });
  }

  /**
   * @param {express.Request<unknown, unknown, ValidUserPayload>} req
   * @param {express.Response} res
   */
  static async createUser(req, res) {
    const user = await UserService.createUser(req.body);

    res.status(201).json({ data: user });
  }
}
