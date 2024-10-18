import express from 'express';
import { AccountService } from '../services/account.js';

/** @import {ValidAccountPayload, ValidAmountPayload} from '../middlewares/validation/account.js' */

export class AccountController {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   */
  static async getAccount(req, res) {
    const account = await AccountService.getAccount(req.params.id);

    res.status(200).json({ data: account });
  }

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  static async getAccounts(req, res) {
    const accounts = await AccountService.getAccounts();

    res.status(200).json({ data: accounts });
  }

  /**
   * @param {express.Request<unknown, ValidAccountPayload>} req
   * @param {express.Response} res
   */
  static async createAccount(req, res) {
    const account = await AccountService.createAccount(req.body);

    res.status(201).json({ data: account });
  }

  /**
   * @param {express.Request<{ id: string }, unknown, ValidAmountPayload>} req
   * @param {express.Response} res
   */
  static async withdrawAccount(req, res) {
    const account = await AccountService.withdrawAccount(
      req.params.id,
      req.body.amount
    );

    res.status(200).json({ data: account });
  }

  /**
   * @param {express.Request<{ id: string }, unknown, ValidAmountPayload>} req
   * @param {express.Response} res
   */
  static async depositAccount(req, res) {
    const account = await AccountService.depositAccount(
      req.params.id,
      req.body.amount
    );

    res.status(200).json({ data: account });
  }
}
