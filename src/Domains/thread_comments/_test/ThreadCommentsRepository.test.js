const ThreadCommentsRepository = require('../ThreadCommentsRepository');

describe('ThreadCommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentsRepository = new ThreadCommentsRepository();

    // Action and Assert
    await expect(threadCommentsRepository.addThreadComments('', '')).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentsRepository.findThreadComments('', '')).rejects.toThrowError('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
