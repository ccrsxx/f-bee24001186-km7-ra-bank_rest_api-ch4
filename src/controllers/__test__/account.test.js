import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

/**
 * @typedef {{
 *   AccountController: Record<
 *     keyof import('../../controllers/account.js')['AccountController'],
 *     jest.Mock
 *   >;
 * }} AccountControllerMock
 */

/**
 * @typedef {{
 *   AccountService: Record<
 *     keyof import('../../services/account.js')['AccountService'],
 *     jest.Mock
 *   >;
 * }} AccountServiceMock
 */

jest.unstable_mockModule(
  '../../services/account.js',
  () =>
    /** @type {AccountServiceMock} */ ({
      AccountService: {
        getAccount: jest.fn(),
        getAccounts: jest.fn(),
        createAccount: jest.fn(),
        depositAccount: jest.fn(),
        withdrawAccount: jest.fn()
      }
    })
);

const { AccountController } = /** @type {AccountControllerMock} */ (
  /** @type {unknown} */ (await import('../../controllers/account.js'))
);

const { AccountService } = /** @type {AccountServiceMock} */ (
  /** @type {unknown} */ (await import('../../services/account.js'))
);

describe('Account controller', () => {
  describe('Get account', () => {
    it('should get an account', async () => {
      const account = { id: '1', name: 'Account' };

      AccountService.getAccount.mockImplementation(() => account);

      const { req, res } = setupExpressMock({ req: { params: { id: '1' } } });

      await AccountController.getAccount(req, res);

      expect(AccountService.getAccount).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: account });
    });
  });

  describe('Get accounts', () => {
    it('should get accounts', async () => {
      const accounts = [{ id: '1', name: 'Account' }];

      AccountService.getAccounts.mockImplementation(() => accounts);

      const { req, res } = setupExpressMock();

      await AccountController.getAccounts(req, res);

      expect(AccountService.getAccounts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: accounts });
    });
  });

  describe('Create account', () => {
    it('should create an account', async () => {
      const account = { id: '10', name: 'Account' };

      AccountService.createAccount.mockImplementation(() => account);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Account' } },
        res: { locals: { user: { id: '1' } } }
      });

      await AccountController.createAccount(req, res);

      expect(AccountService.createAccount).toHaveBeenCalledWith('1', req.body);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: account });
    });
  });

  describe('Withdraw account', () => {
    it('should withdraw an account', async () => {
      const account = { id: '1', name: 'Account', balance: 100 };

      AccountService.withdrawAccount.mockImplementation(() => account);

      const { req, res } = setupExpressMock({
        req: {
          params: { id: '1' },
          body: { amount: 50 }
        }
      });

      await AccountController.withdrawAccount(req, res);

      expect(AccountService.withdrawAccount).toHaveBeenCalledWith('1', 50);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: account });
    });
  });

  describe('Deposit account', () => {
    it('should deposit an account', async () => {
      const account = { id: '1', name: 'Account', balance: 100 };

      AccountService.depositAccount.mockImplementation(() => account);

      const { req, res } = setupExpressMock({
        req: {
          params: { id: '1' },
          body: { amount: 50 }
        }
      });

      await AccountController.depositAccount(req, res);

      expect(AccountService.depositAccount).toHaveBeenCalledWith('1', 50);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: account });
    });
  });
});
