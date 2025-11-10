import { makeAutoObservable } from 'mobx';
import { boardStore, cardStore, authStore } from '../../stores';

export class BoardDetailPageUIStore {
  userId: string;
  boardId: string;

  constructor(userId: string, boardId: string) {
    this.userId = userId;
    this.boardId = boardId;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async init(): Promise<void> {
    await this.loadBoard();
  }

  async loadBoard(): Promise<void> {
    await boardStore.loadBoard(this.userId, this.boardId);
  }

  async createCard(columnId: string, description: string): Promise<boolean> {
    const assignedUserId = authStore.currentUser?.userId;

    const card = await cardStore.createCard(
      this.userId,
      this.boardId,
      columnId,
      description,
      assignedUserId
    );

    if (card) {
      await this.loadBoard();
      return true;
    }

    return false;
  }

  async updateCard(cardId: string, description: string, assignedUserId?: string): Promise<boolean> {
    const card = await cardStore.updateCard(
      this.userId,
      this.boardId,
      cardId,
      description,
      assignedUserId
    );

    if (card) {
      await this.loadBoard();
      return true;
    }

    return false;
  }

  async moveCard(
    cardId: string,
    targetColumnId: string,
    targetOrder: number
  ): Promise<boolean> {
    const card = await cardStore.moveCard(
      this.userId,
      this.boardId,
      cardId,
      targetColumnId,
      targetOrder
    );

    if (card) {
      await this.loadBoard();
      return true;
    }

    return false;
  }

  get isLoading(): boolean {
    return boardStore.loading || cardStore.loading;
  }

  get error(): string | null {
    return boardStore.error || cardStore.error;
  }

  get board() {
    return boardStore.selectedBoard;
  }
}
