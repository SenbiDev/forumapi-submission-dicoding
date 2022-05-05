const ThreadCommentsRepository = require('../../Domains/thread_comments/ThreadCommentsRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadCommentRepositoryPostgres extends ThreadCommentsRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComments(threadComment) {
    const id = `thread_comments-${this._idGenerator()}`;
    const { threadId, commentId } = threadComment;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3)',
      values: [id, threadId, commentId],
    };

    await this._pool.query(query);
  }

  async findThreadComments(threadId, commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE thread_id = $1 AND comment_id = $2',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('THREAD_COMMENTS.NOT_FOUND');
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres;
