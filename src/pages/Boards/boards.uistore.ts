import { makeAutoObservable } from 'mobx';
import { boardStore } from '../../stores';
import type { BoardDto } from '../../api/LemonTaskManagementApiClient';

export class BoardsPageUIStore {
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Initialize the page
   */
  async init(): Promise<void> {
    await this.loadBoards();
  }

  /**
   * Load boards for the current user
   */
  async loadBoards(): Promise<void> {
    await boardStore.loadBoardsForUser(this.userId, 0, 50);
  }

  /**
   * Select a board
   */
  selectBoard(board: BoardDto): void {
    boardStore.selectBoard(board);
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
   * Get boards list
   */
  get boards(): BoardDto[] {
    return boardStore.boards;
  }
}
