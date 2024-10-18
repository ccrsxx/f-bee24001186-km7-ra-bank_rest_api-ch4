import express from 'express';
import { TransactionService } from '../services/transaction.js';

/** @import {ValidTransactionPayload} from '../middlewares/validation/transaction.js' */

export class TransactionController {
  /**
   * @param {express.Request<{ id: string }>} req
   * @param {express.Response} res
   */
  static async getTransaction(req, res) {
    const transaction = await TransactionService.getTransaction(req.params.id);

    res.status(200).json({ data: transaction });
  }

  /**
   * @param {express.Request} req
   * @param {express.Response} res
   */
  static async getTransactions(req, res) {
    const transactions = await TransactionService.getTransactions();

    res.status(200).json({ data: transactions });
  }

  /**
   * @param {express.Request<unknown, unknown, ValidTransactionPayload>} req
   * @param {express.Response} res
   */
  static async createTransaction(req, res) {
    const transaction = await TransactionService.createTransaction(req.body);

    res.status(201).json({ data: transaction });
  }
}
