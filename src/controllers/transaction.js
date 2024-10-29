import { TransactionService } from '../services/transaction.js';

/** @import {Request,Response} from 'express' */
/** @import {ValidTransactionPayload} from '../middlewares/validation/transaction.js' */

export class TransactionController {
  /**
   * @param {Request<{ id: string }>} req
   * @param {Response} res
   */
  static async getTransaction(req, res) {
    const transaction = await TransactionService.getTransaction(req.params.id);

    res.status(200).json({ data: transaction });
  }

  /**
   * @param {Request} _req
   * @param {Response} res
   */
  static async getTransactions(_req, res) {
    const transactions = await TransactionService.getTransactions();

    res.status(200).json({ data: transactions });
  }

  /**
   * @param {Request<unknown, unknown, ValidTransactionPayload>} req
   * @param {Response} res
   */
  static async createTransaction(req, res) {
    const transaction = await TransactionService.createTransaction(req.body);

    res.status(201).json({ data: transaction });
  }
}
