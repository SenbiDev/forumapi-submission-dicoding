/* eslint-disable max-len */
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadCommentsTableHelper = require('../../../../tests/ThreadCommentsTableHelper');
const NewThreadComments = require('../../../Domains/thread_comments/entities/NewThreadComments');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({}); // register user with default parameters
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.addThread({}); // add thread with default paramters
    await CommentsTableTestHelper.addComment({}); // add comment with default paramters
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadCommentsTableHelper.cleanTable();
    await pool.end();
  });

  describe('addThreadComments function', () => {
    it('should persist add threadComments correctly', async () => {
      // Arrange
      const newThreadComments = new NewThreadComments({
        threadId: 'thread-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addThreadComments(newThreadComments);

      // Assert
      const threadComments = await ThreadCommentsTableHelper.findThreadComments('thread_comments-123');
      expect(threadComments).toHaveLength(1);
    });
  });

  describe('findThreadComments function', () => {
    it('should throw NotFoundError when threadComments not found', () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadCommentRepositoryPostgres.findThreadComments('xxx', 'xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadComments found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      await ThreadCommentsTableHelper.addThreadComments({}); // add comment to thread with default paramters

      // Action & Assert
      expect(threadCommentRepositoryPostgres.findThreadComments('thread-123', 'comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });
});
