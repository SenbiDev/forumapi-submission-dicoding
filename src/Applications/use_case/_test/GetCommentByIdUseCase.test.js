const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetCommentByIdUseCase = require('../GetCommentByIdUseCase');

describe('GetCommentByIdUseCase', () => {
  it('should orchestrating the get comment action by id correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const comments = [
      {
        id: 'comment-123',
        username: 'member1',
        date: '2022-02-03T01:20:53.043Z',
        content: 'A Comment content',
      },
    ];

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getCommentByIdUseCase = new GetCommentByIdUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const getCommentsById = await getCommentByIdUseCase.execute(useCaseParams);

    // Assert
    expect(getCommentsById).toStrictEqual(comments);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
  });
});
