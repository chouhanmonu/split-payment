import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddExpenseInput } from './dto/addExpense.input';
import { DataSource, In, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AppJwtPayload } from 'src/types/auth';
import { User } from 'src/users/user.entity';
import { Split } from './split.entity';
import { SplitType, SplitValueType } from 'src/types/expense';
import { getSplitsValueTotal } from 'src/utility/helpers';
@Injectable()
export class ExpensesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addExpense(
    userPayload: AppJwtPayload,
    addExpenseInput: AddExpenseInput,
  ) {
    const user = await this.userRepository.findOneBy({
      id: Number(userPayload.sub),
    });
    if (!user) throw new NotFoundException('User not found');

    const payer = await this.userRepository.findOneBy({
      id: addExpenseInput.payerId,
    });
    if (!payer) throw new NotFoundException('Payer not found');

    const memberIds = addExpenseInput.splits.map((s) => s.memberId);
    const members = await this.userRepository.findBy({ id: In(memberIds) });

    if (members.length !== memberIds.length) {
      throw new BadRequestException('One or more split members not found.');
    }

    if (addExpenseInput.splitType === SplitType.UNEQUAL) {
      if (addExpenseInput.splitValueType === SplitValueType.PERCENT) {
        if (getSplitsValueTotal(addExpenseInput.splits) !== 100)
          throw new BadRequestException("Splits don't add to 100%");
      } else {
        if (
          getSplitsValueTotal(addExpenseInput.splits) !== addExpenseInput.amount
        )
          throw new BadRequestException("Splits don't add to expense amount");
      }
    } else {
      addExpenseInput.splitValueType = SplitValueType.AMOUNT; // set default back
      const fraction = +(
        addExpenseInput.amount / addExpenseInput.splits.length
      ).toFixed(2);
      addExpenseInput.splits = addExpenseInput.splits.map((split) => ({
        ...split,
        value: fraction,
      }));
    }

    return this.dataSource.transaction(async (manager) => {
      const expense = manager.create(Expense, {
        ...addExpenseInput,
        payer,
        addedBy: user,
        splits: undefined,
      });
      const savedExpense = await manager.save(expense);

      const splitEntities = addExpenseInput.splits.map((s) =>
        manager.create(Split, {
          ...s,
          expense: savedExpense,
          valueType: addExpenseInput.splitValueType,
          member: members.find((m) => m.id === s.memberId),
        }),
      );
      const savedSplits = await manager.save(Split, splitEntities);
      savedExpense.splits = savedSplits;

      return savedExpense;
    });
  }
}

// continue https://chatgpt.com/c/692f18f2-f8a4-8322-84d9-586fbc360658
