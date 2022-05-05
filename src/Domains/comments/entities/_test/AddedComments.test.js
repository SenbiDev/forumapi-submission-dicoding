const AddedComments = require('../AddedComments');

describe('a AddedComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      content: true,
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComments(payload)).toThrowError('ADDED_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'A content',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new AddedComments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
