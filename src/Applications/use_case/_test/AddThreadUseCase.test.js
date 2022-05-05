const AddThreads = require('../../../Domains/threads/entities/AddThreads');
const AddedThreads = require('../../../Domains/threads/entities/AddedThreads');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCaseAuthentications = {
      userId: 'user-123',
    };

    const useCasePayload = {
      title: 'A Thread Title',
      body: 'A Body Title',
    };

    const expectedAddedThreads = new AddedThreads({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThreads));

    /** creating use case instance */
    const getAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThreads = await getAddThreadUseCase
      .execute(useCasePayload, useCaseAuthentications.userId);

    // Assert
    expect(addedThreads).toStrictEqual(expectedAddedThreads);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThreads({
      title: 'A Thread Title',
      body: 'A Body Title',
    }), useCaseAuthentications.userId);
  });
});
