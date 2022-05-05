class DeleteCommentUseCase {
  constructor({ threadCommentsRepository, commentRepository }) {
    this.threadCommentsRepository = threadCommentsRepository;
    this.commentRepository = commentRepository;
  }

  async execute(userId, useCaseParams) {
    const { threadId, commentId } = useCaseParams;
    await this.threadCommentsRepository.findThreadComments(threadId, commentId);
    await this.commentRepository.checkAuthorization(userId, commentId);
    await this.commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
