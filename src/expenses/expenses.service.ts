import { Injectable } from '@nestjs/common';
import { AddExpenseInput } from './dto/addExpense.input';

@Injectable()
export class ExpensesService {
  addExpense(addExpenseInput: AddExpenseInput) {
    return {
      id: 1,
      description: addExpenseInput.description,
    };
  }
}
