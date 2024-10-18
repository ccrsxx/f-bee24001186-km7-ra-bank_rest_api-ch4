import express from 'express';
import { TransactionService } from '../services/transaction.js';

/** @import {ValidTransactionPayload} from '../middlewares/validation/transaction.js' */

export class TransactionController {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   */
  static async getTransaction(req, res) {
    const user = await TransactionService.getTransaction(req.params.id);

    res.status(201).json({ data: user });
  }

  /**
   * @param {express.Request<unknown, ValidTransactionPayload>} req
   * @param {express.Response} res
   */
  static async getTransactions(req, res) {
    const users = await TransactionService.getTransactions();

    res.status(201).json({ data: users });
  }

  /**
   * @param {express.Request<unknown, ValidTransactionPayload>} req
   * @param {express.Response} res
   */
  static async createTransaction(req, res) {
    const user = await TransactionService.createTransaction(req.body);

    res.status(201).json({ data: user });
  }
}
