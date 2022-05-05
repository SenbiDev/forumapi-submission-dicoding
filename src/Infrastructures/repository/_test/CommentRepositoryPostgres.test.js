const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadCommentsTableHelper = require('../../../../tests/ThreadCommentsTableHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComments = require('../../../Domains/comments/entities/AddComments');
const AddedComments = require('../../../Domains/comments/entities/AddedComments');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({}); // register user with default parameters
    await UsersTableTestHelper.addUser({
      id: 'user-345', username: 'guest', password: 'asdfkl', fullname: 'other user',
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await ThreadCommentsTableHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const useCaseAuthentications = {
        userId: 'user-123',
      };

      const addComments = new AddComments({
        content: 'A Comment content',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComments, useCaseAuthentications.userId);

      // Assert
      const comments = await CommentsTableTestHelper.findComment('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const useCaseAuthentications = {
        userId: 'user-123',
      };

      const addComments = new AddComments({
        content: 'A Comment content',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres
        .addComment(addComments, useCaseAuthentications.userId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComments({
        id: 'comment-123',
        content: 'A Comment content',
        owner: 'user-123',
      }));
    });
  });

  describe('checkAuthorization function', () => {
    it('should throw AuthorizationError when a user accesses an unauthorized resource', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      CommentsTableTestHelper.addComment({}); // add comment with default paramters
      const userId = await UsersTableTestHelper.findUsersById('user-345');
      const commentId = await CommentsTableTestHelper.findComment('comment-123');

      // Action & Assert
      return expect(commentRepositoryPostgres.checkAuthorization(userId[0].id, commentId[0].id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when a user accesses an authorized resource', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      CommentsTableTestHelper.addComment({}); // add comment with default paramters
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      const commentId = await CommentsTableTestHelper.findComment('comment-123');

      // Action & Assert
      return expect(commentRepositoryPostgres.checkAuthorization(userId[0].id, commentId[0].id))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('checkAvailabilityComment function', () => {
    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.checkAvailabilityComment('xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return comment id when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ content: 'A Comment content' });

      // Action & Assert
      const commentId = await commentRepositoryPostgres.checkAvailabilityComment('comment-123');
      expect(commentId).toBe('comment-123');
    });
  });

  describe('getCommentById function', () => {
    it('should return comment details', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await ThreadsTableTestHelper.addThread({}); // add thread with default parameters
      await CommentsTableTestHelper.addComment({}); // add comment with default parameters
      await ThreadCommentsTableHelper.addThreadComments({}); // with default params

      // Action & Assert
      const commentDetails = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(commentDetails).toStrictEqual(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2022-02-01T09:53:50.000Z',
            content: 'content for comment',
          },
        ],
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete comment by soft delete', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await CommentsTableTestHelper.addComment({ content: 'A Comment content' });
      const comment = await CommentsTableTestHelper.findComment('comment-123');

      // Action
      await commentRepositoryPostgres.deleteComment(comment[0].id);

      // Assert
      const commentBySoftDelete = await CommentsTableTestHelper.findComment('comment-123');
      expect(commentBySoftDelete[0]).toStrictEqual({
        id: 'comment-123',
        owner: 'user-123',
        date: '2022-02-01T09:53:50.000Z',
        content: 'A Comment content',
        is_delete: 'true',
      });
    });
  });
});
