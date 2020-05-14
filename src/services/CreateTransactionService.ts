import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const transactionRepo = getRepository(Transaction);
    const categoryRepo = getRepository(Category);

    let categoryObject = await categoryRepo.findOne({
      where: { title: category },
    });
    console.log({ categoryObject });
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
