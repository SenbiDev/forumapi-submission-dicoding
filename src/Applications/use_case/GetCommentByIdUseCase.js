class GetCommentByIdUseCase {
  constructor({ commentRepository }) {
    this.commentRepository = commentRepository;
  }

  async execute(useCaseParams) {
    const { threadId } = useCaseParams;
    return this.commentRepository.getCommentByThreadId(threadId);
  }
}

module.exports = GetCommentByIdUseCase;
