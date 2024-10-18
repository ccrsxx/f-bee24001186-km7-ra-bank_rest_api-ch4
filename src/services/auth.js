import bcrypt from 'bcrypt';

export class AuthService {
  /**
   * @param {string} password
   * @param {number} salt
   */
  static async hashPassword(password, salt = 10) {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   */
  static async isPasswordMatch(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
