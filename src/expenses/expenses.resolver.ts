import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ExpensesService } from './expenses.service';
import { AddExpenseInput } from './dto/addExpense.input';
import { ExpenseModel } from './models/expense.model';
import { User } from 'src/auth/auth.decorator';
import type { AppJwtPayload } from 'src/types/auth';

@Resolver()
export class ExpensesResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Mutation(() => ExpenseModel)
  addExpense(
    @User() user: AppJwtPayload,
    @Args('addExpenseInput') addExpenseInput: AddExpenseInput,
  ) {
    return this.expensesService.addExpense(user, addExpenseInput);
  }
}
