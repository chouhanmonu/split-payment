import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExpensesService } from './expenses.service';
import { AddExpenseInput } from './dto/addExpense.input';
import { ExpenseModel } from './models/expense.model';

@Resolver()
export class ExpensesResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Mutation(() => ExpenseModel)
  addExpense(@Args('addExpenseInput') addExpenseInput: AddExpenseInput) {
    return this.expensesService.addExpense(addExpenseInput);
  }
}
