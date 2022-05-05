class NewThreadComments {
  constructor(params) {
    this._verifyPayload(params);

    this.threadId = params.threadId;
    this.commentId = params.commentId;
  }

  _verifyPayload(payload) {
    const { threadId, commentId } = payload;

    if (!threadId || !commentId) {
      throw new Error('NEW_THREAD_COMMENTS.NOT_CONTAIN_NEEDED_PARAMS');
    }
  }
}

module.exports = NewThreadComments;
