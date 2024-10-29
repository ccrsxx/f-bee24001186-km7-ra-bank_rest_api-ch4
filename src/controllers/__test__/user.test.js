import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

/**
 * @typedef {{
 *   UserController: Record<
 *     keyof import('../../controllers/user.js')['UserController'],
 *     jest.Mock
 *   >;
 * }} UserControllerMock
 */

/**
 * @typedef {{
 *   UserService: Record<
 *     keyof import('../../services/user.js')['UserService'],
 *     jest.Mock
 *   >;
 * }} UserServiceMock
 */

jest.unstable_mockModule(
  '../../services/user.js',
  () =>
    /** @type {UserServiceMock} */ ({
      UserService: {
        getUser: jest.fn(),
        getUsers: jest.fn(),
        createUser: jest.fn()
      }
    })
);

const { UserController } = /** @type {UserControllerMock} */ (
  /** @type {unknown} */ (await import('../../controllers/user.js'))
);

const { UserService } = /** @type {UserServiceMock} */ (
  /** @type {unknown} */ (await import('../../services/user.js'))
);

describe('User controller', () => {
  describe('Get user', () => {
    it('should get a user', async () => {
      const user = { id: '1', name: 'User' };

      UserService.getUser.mockImplementation(() => user);

      const { req, res } = setupExpressMock({ req: { params: { id: '1' } } });

      await UserController.getUser(req, res);

      expect(UserService.getUser).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: user });
    });
  });

  describe('Get current user', () => {
    it('should get the current user', async () => {
      const user = { id: '1', name: 'User' };

      const { req, res } = setupExpressMock({ res: { locals: { user } } });

      await UserController.getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: user });
    });
  });

  describe('Get users', () => {
    it('should get users', async () => {
      const users = [{ id: '1', name: 'User' }];

      UserService.getUsers.mockImplementation(() => users);

      const { req, res } = setupExpressMock();

      await UserController.getUsers(req, res);

      expect(UserService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: users });
    });
  });

  describe('Create user', () => {
    it('should create a user', async () => {
      const user = { id: '1', name: 'User' };

      UserService.createUser.mockImplementation(() => user);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'User' } }
      });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith({ name: 'User' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: user });
    });
  });
});
