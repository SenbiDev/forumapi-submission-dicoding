const AddComments = require('../../../Domains/comments/entities/AddComments');
const AddedComments = require('../../../Domains/comments/entities/AddedComments');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentsRepository = require('../../../Domains/thread_comments/ThreadCommentsRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const useCaseAuthentications = {
      userId: 'user-123',
    };

    const useCasePayload = {
      content: 'A comment content',
    };

    const expectedAddedComments = new AddedComments({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const threadComment = {
      threadId: useCaseParams.threadId,
      commentId: expectedAddedComments.id,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadCommentsRepository = new ThreadCommentsRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => expectedAddedComments);
    mockThreadCommentsRepository.addThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
    });

    // Action
    const addedComments = await addCommentUseCase
      .execute(useCaseParams, useCasePayload, useCaseAuthentications.userId);

    // Assert
    expect(addedComments).toStrictEqual(expectedAddedComments);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComments({ content: 'A comment content' }), useCaseAuthentications.userId);
    expect(mockThreadCommentsRepository.addThreadComments)
      .toBeCalledWith(threadComment);
  });
});
