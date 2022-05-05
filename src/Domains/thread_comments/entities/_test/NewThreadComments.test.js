const NewThreadComments = require('../NewThreadComments');

describe('newThreadComments entities', () => {
  it('should throw error when url not contain needed params', () => {
    // Arrange
    const params = {
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new NewThreadComments(params)).toThrowError('NEW_THREAD_COMMENTS.NOT_CONTAIN_NEEDED_PARAMS');
  });

  it('should create newThreadComments entities correctly', () => {
    // Arrange
    const params = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    // Action
    const newThreadComments = new NewThreadComments(params);

    // Assert
    expect(newThreadComments).toBeInstanceOf(NewThreadComments);
    expect(newThreadComments.threadId).toEqual(params.threadId);
    expect(newThreadComments.commentId).toEqual(params.commentId);
  });
});
