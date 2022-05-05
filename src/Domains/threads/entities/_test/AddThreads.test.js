const AddThreads = require('../AddThreads');

describe('a AddThreads entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'abc',
    };

    // Action and Assert
    expect(() => new AddThreads(payload)).toThrowError('ADD_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThreads(payload)).toThrowError('ADD_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      title: 'A Thread',
      body: 'A Thread',
    };

    // Action
    const { title, body } = new AddThreads(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
