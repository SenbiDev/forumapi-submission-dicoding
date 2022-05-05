/* eslint-disable no-unused-vars */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forum_api_app_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentByThreadIdHandler,
    options: {
      auth: 'forum_api_app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByThreadIdHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentByThreadAndCommentIdHandler,
    options: {
      auth: 'forum_api_app_jwt',
    },
  },
];

module.exports = routes;
