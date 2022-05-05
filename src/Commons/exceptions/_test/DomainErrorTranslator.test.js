const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');
const NotFoundError = require('../NotFoundError');
const AuthorizationError = require('../AuthorizationError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREADS.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_THREADS.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('ADD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat komentar baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('THREAD.NOT_FOUND')))
      .toStrictEqual(new NotFoundError('tidak dapat menambahkan komentar ke thread karena thread tidak ada atau tidak valid'));
    expect(DomainErrorTranslator.translate(new Error('COMMENTS.NOT_FOUND')))
      .toStrictEqual(new NotFoundError('komentar tidak ada atau tidak valid'));
    expect(DomainErrorTranslator.translate(new Error('COMMENTS.ACCESS_DENIED')))
      .toStrictEqual(new AuthorizationError('anda tidak berhak mengakses resource ini'));
    expect(DomainErrorTranslator.translate(new Error('THREAD_COMMENTS.NOT_FOUND')))
      .toStrictEqual(new NotFoundError('thread atau komentar tidak ada atau tidak valid'));
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
