import { makeObservable, observable, runInAction } from 'mobx';
import { BaseStore } from './base.store';
import type { BoardDto } from '../api/LemonTaskManagementApiClient';

export class BoardStore extends BaseStore {
  boards: BoardDto[] = [];
  selectedBoard: BoardDto | null = null;
  currentUserId: string | null = null;

  constructor() {
    super();
    makeObservable(this, {
      boards: observable,
      selectedBoard: observable,
      currentUserId: observable,
    });
  }

  /**
   * Load boards for a specific user
   */
  async loadBoardsForUser(userId: string, skip = 0, take = 50): Promise<void> {
    await this.executeAsync(async () => {
      const response = await this.apiClient.userBoards_GetUserBoards(
        userId,
        userId,
        skip,
        take
      );

      runInAction(() => {
        if (response.result?.data) {
          this.boards = response.result.data
            .map((userBoard) => userBoard.board)
            .filter((board): board is BoardDto => board !== undefined);
          this.currentUserId = userId;
        }
      });
    }, 'Failed to load boards');
  }

  /**
   * Load a specific board
   */
  async loadBoard(userId: string, boardId: string): Promise<void> {
    await this.executeAsync(async () => {
      const response = await this.apiClient.userBoards_GetUserBoard(userId, boardId);

      runInAction(() => {
        if (response.result?.data) {
          this.selectedBoard = response.result.data.board || null;
        }
      });
    }, 'Failed to load board');
  }

  /**
   * Select a board
   */
  selectBoard(board: BoardDto | null): void {
    runInAction(() => {
      this.selectedBoard = board;
    });
  }

  /**
   * Clear selected board
   */
  clearSelectedBoard(): void {
    this.selectBoard(null);
  }

  /**
   * Reset store
   */
  override reset(): void {
    super.reset();
    runInAction(() => {
      this.boards = [];
      this.selectedBoard = null;
      this.currentUserId = null;
    });
  }
}

export const boardStore = new BoardStore();
