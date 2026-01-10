import { Module } from '@nestjs/common';
import { Split } from './entities/split.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesResolver } from './expenses.resolver';
import { ExpensesService } from './expenses.service';
import { User } from 'src/users/entities/user.entity';
import { Expense } from './entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Split, User])],
  exports: [TypeOrmModule],
  providers: [ExpensesResolver, ExpensesService],
})
export class ExpensesModule {}
