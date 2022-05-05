const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread action by id correctly', async () => {
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

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));

    /** creating use case instance */
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const getThreadsById = await getThreadByIdUseCase.execute(useCaseParams);

    // Assert
    expect(getThreadsById).toStrictEqual(thread);
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCaseParams.threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId);
  });
});
