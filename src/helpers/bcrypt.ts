import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string[]> => {
  const passwordHash = await bcrypt.hash(password, 10);

  return [passwordHash];
};
