const AddThreads = require('../../Domains/threads/entities/AddThreads');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const addThreads = new AddThreads(useCasePayload);
    return this.threadRepository.addThread(addThreads, userId);
  }
}

module.exports = AddThreadUseCase;
