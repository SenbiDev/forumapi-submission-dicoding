const AddedThreads = require('../AddedThreads');

describe('a AddedThreads entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddedThreads(payload)).toThrowError('ADDED_THREADS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'abc',
      title: 123,
      owner: 345,
    };

    // Action and Assert
    expect(() => new AddedThreads(payload)).toThrowError('ADDED_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threads object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-12345',
      title: 'A Thread Title',
      owner: 'user-12345',
    };

    // Action
    const { id, title, owner } = new AddedThreads(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
