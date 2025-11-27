import { Module } from '@nestjs/common';
import { Expense } from './expense.entity';
import { Split } from './split.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Split])],
  exports: [TypeOrmModule],
  providers: [ExpensesResolver, ExpensesService],
})
export class ExpensesModule {}
