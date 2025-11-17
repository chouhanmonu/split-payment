import { customAlphabet } from 'nanoid';

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
