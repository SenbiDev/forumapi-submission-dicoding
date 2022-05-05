/* eslint-disable camelcase */
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComments = require('../../Domains/comments/entities/AddedComments');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const mapDB = require('../../Applications/utils/mapDB');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComments, userId) {
    const { content } = addComments;
    const id = `comment-${this._idGenerator()}`;
    const owner = userId;
    const date = new Date().toISOString();
    const is_delete = String(content === '**komentar telah dihapus**');

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, owner, date, content, is_delete],
    };

    const result = await this._pool.query(query);

    return new AddedComments({ ...result.rows[0] });
  }

  async checkAuthorization(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('COMMENTS.ACCESS_DENIED');
    }
  }

  async checkAvailabilityComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('COMMENTS.NOT_FOUND');
    }

    return result.rows[0].id;
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id,
      users.username,
      comments.date,
      comments.content,
      comments.is_delete 
      FROM threads INNER JOIN thread_comments
      ON threads.id = thread_comments.thread_id
      INNER JOIN comments
      ON thread_comments.comment_id = comments.id
      INNER JOIN users
      ON comments.owner = users.id 
      WHERE threads.id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    const returnValue = result.rows.map(mapDB);

    return returnValue;
  }

  async deleteComment(commentId) {
    const query = {
      text: `UPDATE comments 
      SET is_delete = 'true'
      WHERE id = $1 
      RETURNING id, owner, date, content, is_delete`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }
}

module.exports = CommentRepositoryPostgres;
