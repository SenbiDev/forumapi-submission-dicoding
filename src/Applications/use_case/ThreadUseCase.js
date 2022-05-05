class ThreadUseCase {
  constructor({ threadUseCaseById, commentUseCaseById }) {
    this.threadUseCaseById = threadUseCaseById;
    this.commentUseCaseById = commentUseCaseById;
  }

  async execute(useCaseParams) {
    const thread = await this.threadUseCaseById.execute(useCaseParams);
    const comments = await this.commentUseCaseById.execute(useCaseParams);
    thread.comments = comments;

    return thread;
  }
}

module.exports = ThreadUseCase;
