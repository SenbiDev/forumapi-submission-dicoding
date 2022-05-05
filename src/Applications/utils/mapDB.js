/* eslint-disable no-param-reassign */
const mapDB = (item) => {
  if (item.is_delete === 'true') {
    item.content = '**komentar telah dihapus**';
  }

  return {
    id: item.id, username: item.username, date: item.date, content: item.content,
  };
};

module.exports = mapDB;
