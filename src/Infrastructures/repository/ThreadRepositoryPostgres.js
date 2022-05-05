const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThreads = require('../../Domains/threads/entities/AddedThreads');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThreads, userId) {
    const { title, body } = addThreads;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const owner = userId;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThreads({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id,
      threads.title,
      threads.body,
      threads.date,
      users.username 
      FROM threads INNER JOIN users
      ON threads.owner = users.id 
      WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return { ...result.rows[0] };
  }

  async checkAvailabilityThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('THREAD.NOT_FOUND');
    }

    return result.rows[0].id;
  }
}

module.exports = ThreadRepositoryPostgres;
