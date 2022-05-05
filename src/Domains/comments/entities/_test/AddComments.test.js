const AddComments = require('../AddComments');

describe('a AddComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddComments(payload)).toThrowError('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComments(payload)).toThrowError('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comments object correctly', () => {
    // Arrange
    const payload = {
      content: 'A Content',
    };

    // Action
    const { content } = new AddComments(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
