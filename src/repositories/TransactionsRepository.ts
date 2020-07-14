import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        if (transaction.type === 'income') {
          return {
            income: accumulator.income + Number(transaction.value),
            outcome: accumulator.outcome,
          };
        }
        return {
          income: accumulator.income,
          outcome: accumulator.outcome + Number(transaction.value),
        };
      },
      { income: 0, outcome: 0 },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
