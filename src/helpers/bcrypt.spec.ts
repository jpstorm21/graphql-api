import * as bcrypt from 'bcrypt';
import { encryptPassword } from './bcrypt';

describe('bcrypt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should encrypt password successfully', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('pass_encrypted'));

    const response = await encryptPassword('mi_password');
    expect(response).toEqual(['pass_encrypted']);
    expect(bcrypt.hash).toHaveBeenCalledWith('mi_password', 10);
  });

  it('should handle encryption errors', async () => {
    const error = new Error('Encryption failed');
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.reject(error));

    await expect(encryptPassword('mi_password')).rejects.toThrow(error);
  });

  it('should return array with hashed password', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashed_password_123'));

    const result = await encryptPassword('test_password');

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('hashed_password_123');
  });
});
