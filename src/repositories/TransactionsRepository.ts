import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find({});

    let total = 0;
    let income = 0;
    let outcome = 0;

    transactions.forEach(element => {
      if (element.type === 'income') income += element.value;
      else outcome += element.value;
    });

    total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
