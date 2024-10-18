import express from 'express';
import { AccountService } from '../services/account.js';

/** @import {ValidUserPayload} from '../middlewares/validation/user.js' */

export class AccountController {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   */
  static async getAccount(req, res) {
    const account = await AccountService.getAccount(req.params.id);

    res.status(201).json({ data: account });
  }

  /**
   * @param {express.Request<unknown, ValidUserPayload>} req
   * @param {express.Response} res
   */
  static async getAccounts(req, res) {
    const accounts = await AccountService.getAccounts();

    res.status(201).json({ data: accounts });
  }

  /**
   * @param {express.Request<unknown, ValidUserPayload>} req
   * @param {express.Response} res
   */
  static async createAccount(req, res) {
    const account = await AccountService.createAccount(req.body);

    res.status(201).json({ data: account });
  }
}
