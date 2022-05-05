const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const GetCommentByIdUseCase = require('../GetCommentByIdUseCase');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  it('should orchestrating the thread action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId: 'thread-123',
    };

    const thread = {
      id: 'thread-123',
      title: 'A Title of thread',
      body: 'A Body of thread',
      date: '2022-02-03T01:10:53.043Z',
      username: 'dicoding',
    };

    const comment = [
      {
        id: 'comment-123',
        username: 'member1',
        date: '2022-02-03T01:20:53.043Z',
        content: 'A Comment content',
      },
    ];

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({}); // !dummy
    const getCommentByIdUseCase = new GetCommentByIdUseCase({}); // !dummy

    /** mocking needed function */
    getThreadByIdUseCase.execute = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    getCommentByIdUseCase.execute = jest.fn()
      .mockImplementation(() => Promise.resolve(comment));

    const threadUseCase = new ThreadUseCase({
      threadUseCaseById: getThreadByIdUseCase,
      commentUseCaseById: getCommentByIdUseCase,
    });

    const getTheadUseCase = await threadUseCase.execute(useCaseParams);

    // Assert
    expect(getTheadUseCase).toStrictEqual(
      {
        id: 'thread-123',
        title: 'A Title of thread',
        body: 'A Body of thread',
        date: '2022-02-03T01:10:53.043Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'member1',
            date: '2022-02-03T01:20:53.043Z',
            content: 'A Comment content',
          },
        ],
      },
    );
    expect(getThreadByIdUseCase.execute).toBeCalledWith(useCaseParams);
    expect(getCommentByIdUseCase.execute).toBeCalledWith(useCaseParams);
  });
});
