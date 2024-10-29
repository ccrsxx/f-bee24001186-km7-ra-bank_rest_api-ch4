import { AccountService } from '../services/account.js';

/** @import {Request, Response} from 'express' */
/** @import {User} from '@prisma/client' */
/** @import {ValidAccountPayload, ValidAmountPayload} from '../middlewares/validation/account.js' */

export class AccountController {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} res
   */
  static async getAccount(req, res) {
    const account = await AccountService.getAccount(req.params.id);

    res.status(200).json({ data: account });
  }

  /**
   * @param {Request} _req
   * @param {Response} res
   */
  static async getAccounts(_req, res) {
    const accounts = await AccountService.getAccounts();

    res.status(200).json({ data: accounts });
  }

  /**
   * @param {Request<unknown, ValidAccountPayload>} req
   * @param {Response<unknown, { user: User }>} res
   */
  static async createAccount(req, res) {
    const account = await AccountService.createAccount(
      res.locals.user.id,
      req.body
    );

    res.status(201).json({ data: account });
  }

  /**
   * @param {Request<{ id: string }, unknown, ValidAmountPayload>} req
   * @param {Response} res
   */
  static async withdrawAccount(req, res) {
    const account = await AccountService.withdrawAccount(
      req.params.id,
      req.body.amount
    );

    res.status(200).json({ data: account });
  }

  /**
   * @param {Request<{ id: string }, unknown, ValidAmountPayload>} req
   * @param {Response} res
   */
  static async depositAccount(req, res) {
    const account = await AccountService.depositAccount(
      req.params.id,
      req.body.amount
    );

    res.status(200).json({ data: account });
  }
}
