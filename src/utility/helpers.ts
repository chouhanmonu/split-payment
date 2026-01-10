import { customAlphabet } from 'nanoid';
import { SplitInput } from 'src/expenses/inputs/add-expense.input';

export const generateUserUid = (name?: string) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);
  const prefix = name
    ? name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20)
    : 'user';
  return `${prefix}_${nanoid()}`;
};

export function getSplitsValueTotal(splits: SplitInput[]) {
  return splits.reduce((a, c) => a + c.value, 0);
}
