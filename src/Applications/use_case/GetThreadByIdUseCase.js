class GetThreadByIdUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    await this.threadRepository.checkAvailabilityThread(threadId);
    return this.threadRepository.getThreadById(threadId);
  }
}

module.exports = GetThreadByIdUseCase;
