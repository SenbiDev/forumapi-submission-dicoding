const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentByThreadIdHandler = this.postCommentByThreadIdHandler.bind(this);
    this.getThreadByThreadIdHandler = this.getThreadByThreadIdHandler.bind(this);
    this.deleteCommentByThreadAndCommentIdHandler = this
      .deleteCommentByThreadAndCommentIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentByThreadIdHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(request.params, request.payload, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByThreadIdHandler(request) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await threadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async deleteCommentByThreadAndCommentIdHandler(request) {
    const { id: userId } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(userId, request.params);
    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
