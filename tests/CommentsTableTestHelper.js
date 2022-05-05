/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    owner = 'user-123',
    date = '2022-02-01T09:53:50.000Z',
    content = 'content for comment',
    is_delete = 'false',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, date, content, is_delete],
    };

    await pool.query(query);
  },

  async findComment(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
