const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThreads = require('../../../Domains/threads/entities/AddThreads');
const AddedThreads = require('../../../Domains/threads/entities/AddedThreads');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({}); // register user with default parameters
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const useCaseAuthentications = {
        userId: 'user-123',
      };

      const addThreads = new AddThreads({
        title: 'A Thread title',
        body: 'A Thread body',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThreads, useCaseAuthentications.userId);

      // Assert
      const threads = await ThreadsTableTestHelper.findThread('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const useCaseAuthentications = {
        userId: 'user-123',
      };

      const addThreads = new AddThreads({
        title: 'A Thread title',
        body: 'A Thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres
        .addThread(addThreads, useCaseAuthentications.userId);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThreads({
        id: 'thread-123',
        title: 'A Thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.checkAvailabilityThread('xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread id when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        title: 'A Thread title',
        body: 'A Thread body',
      });

      // Action & Assert
      const threadId = await threadRepositoryPostgres.checkAvailabilityThread('thread-123');
      expect(threadId).toBe('thread-123');
    });
  });

  describe('getThreadById function', () => {
    it('should return thread details when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        title: 'A Thread title',
        body: 'A Thread body',
      });

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(threadDetails).toStrictEqual({
        id: 'thread-123',
        title: 'A Thread title',
        body: 'A Thread body',
        date: '2022-02-01T09:43:50.000Z',
        username: 'dicoding',
      });
    });
  });
});
