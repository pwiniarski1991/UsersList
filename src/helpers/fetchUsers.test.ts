import { fetchUsers } from './fetchUsers';
import users from './../mocks/users.json';

describe('fetchUsers', () => {

  const realFetch = global.fetch;
  const realConsole = global.console;
  const mockJson = jest.fn();

  beforeAll(() => {
    global.console = {
      ...realConsole,
      error: jest.fn()
    }
    global.fetch = () =>
      Promise.resolve({
        ...realFetch,
        json: mockJson.mockResolvedValue(users),
      })
  })

  afterAll(() => {
    global.console = realConsole;
    global.fetch = realFetch;
  })

  it('returns users when function succeed', async () => {
    const fetchedUsers = await fetchUsers();
    expect(fetchedUsers).toEqual(users);
  });

  it('returns error when function fails', async () => {
    global.fetch = () => Promise.resolve(realFetch);
    mockJson.mockRejectedValue('error with no json function');
    const error = await fetchUsers();
    expect(error).toEqual(undefined);
  })
})