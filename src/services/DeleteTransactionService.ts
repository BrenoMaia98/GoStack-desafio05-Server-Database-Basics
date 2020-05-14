import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    const transaction = await transactionRepository.findOne({ where: { id } });

    if (!transaction) throw new AppError('Could not find transaction!', 404);

    await transactionRepository.delete(id);

    return transaction;
  }
}

export default DeleteTransactionService;
