const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadCommentsRepository = require('../../../Domains/thread_comments/ThreadCommentsRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const useCaseAuthentications = {
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadCommentsRepository = new ThreadCommentsRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadCommentsRepository.findThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAuthorization = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadCommentsRepository: mockThreadCommentsRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCaseAuthentications.userId, useCaseParams);

    // Assert
    expect(mockThreadCommentsRepository.findThreadComments)
      .toBeCalledWith(useCaseParams.threadId, useCaseParams.commentId);
    expect(mockCommentRepository.checkAuthorization)
      .toBeCalledWith(useCaseAuthentications.userId, useCaseParams.commentId);
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCaseParams.commentId);
  });
});
