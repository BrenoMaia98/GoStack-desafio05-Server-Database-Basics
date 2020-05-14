import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  category: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    value,
    type,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const categoryRepo = getRepository(Category);

    const balance = await transactionRepo.getBalance();

    if (balance.total < value && type === 'outcome')
      throw new AppError(
        `Cannot create withdraw transaction greater than ${balance.total}!`,
      );

    let categoryObject = await categoryRepo.findOne({
      where: { title: category },
    });

    if (!categoryObject) {
      categoryObject = categoryRepo.create({ title: category });
      await categoryRepo.save(categoryObject);
    }

    const newTransaction = transactionRepo.create({
      category_id: categoryObject.id,
      title,
      value,
      type,
    });

    await transactionRepo.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
