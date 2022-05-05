exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"threads"',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
