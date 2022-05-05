const AddComments = require('../../Domains/comments/entities/AddComments');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository, threadCommentsRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.threadCommentsRepository = threadCommentsRepository;
  }

  async execute({ threadId }, useCasePayload, userId) {
    await this.threadRepository.checkAvailabilityThread(threadId);
    const addComments = new AddComments(useCasePayload);
    const addedComments = await this.commentRepository.addComment(addComments, userId);
    const threadComment = {
      threadId,
      commentId: addedComments.id,
    };
    await this.threadCommentsRepository.addThreadComments(threadComment);
    return addedComments;
  }
}

module.exports = AddCommentUseCase;
