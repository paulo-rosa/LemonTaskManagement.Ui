import { makeAutoObservable } from 'mobx';
import { boardStore } from '../../stores';

export class BoardDetailPageUIStore {
  userId: string;
  boardId: string;

  constructor(userId: string, boardId: string) {
    this.userId = userId;
    this.boardId = boardId;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Initialize the page
   */
  async init(): Promise<void> {
    await this.loadBoard();
  }

  /**
   * Load board details
   */
  async loadBoard(): Promise<void> {
    await boardStore.loadBoard(this.userId, this.boardId);
  }

  /**
   * Get whether loading
   */
  get isLoading(): boolean {
    return boardStore.loading;
  }

  /**
   * Get error
   */
  get error(): string | null {
    return boardStore.error;
  }

  /**
   * Get selected board
   */
  get board() {
    return boardStore.selectedBoard;
  }
}
