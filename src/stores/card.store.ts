import { makeObservable, observable, runInAction } from 'mobx';
import { BaseStore } from './base.store';
import { CreateCardCommand, UpdateCardCommand, MoveCardCommand, CardDto } from '../api/LemonTaskManagementApiClient';

export class CardStore extends BaseStore {
  cards: CardDto[] = [];
  selectedCard: CardDto | null = null;

  constructor() {
    super();
    makeObservable(this, {
      cards: observable,
      selectedCard: observable,
    });
  }

  async createCard(
    userId: string,
    boardId: string,
    columnId: string,
    description: string,
    assignedUserId?: string
  ): Promise<CardDto | null> {
    const command = new CreateCardCommand({
      userId,
      boardId,
      boardColumnId: columnId,
      description,
      assignedUserId,
    });

    const result = await this.executeAsync(async () => {
      const response = await this.apiClient.userBoards_CreateCard(
        userId,
        boardId,
        command
      );

      if (response.result?.data) {
        const newCard = new CardDto({
          id: response.result.data.id,
          boardColumnId: response.result.data.boardColumnId,
          description: response.result.data.description,
          order: response.result.data.order,
          assignedUserId: response.result.data.assignedUserId,
          assignedUser: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        runInAction(() => {
          this.cards.push(newCard);
        });

        return newCard;
      }

      return null;
    }, 'Failed to create card');

    return result || null;
  }

  async updateCard(
    userId: string,
    boardId: string,
    cardId: string,
    description: string,
    assignedUserId?: string
  ): Promise<CardDto | null> {
    const command = new UpdateCardCommand({
      userId,
      boardId,
      cardId,
      description,
      assignedUserId,
    });

    const result = await this.executeAsync(async () => {
      const response = await this.apiClient.userBoards_UpdateCard(
        userId,
        boardId,
        cardId,
        command
      );

      if (response.result?.data) {
        const updatedCard = new CardDto({
          id: response.result.data.id,
          boardColumnId: response.result.data.boardColumnId,
          description: response.result.data.description,
          order: response.result.data.order,
          assignedUserId: response.result.data.assignedUserId,
          assignedUser: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        runInAction(() => {
          const index = this.cards.findIndex((c) => c.id === cardId);
          if (index !== -1) {
            this.cards[index] = updatedCard;
          }
        });

        return updatedCard;
      }

      return null;
    }, 'Failed to update card');

    return result || null;
  }

  async moveCard(
    userId: string,
    boardId: string,
    cardId: string,
    targetColumnId: string,
    targetOrder: number
  ): Promise<CardDto | null> {
    const command = new MoveCardCommand({
      userId,
      boardId,
      cardId,
      targetBoardColumnId: targetColumnId,
      targetOrder,
    });

    const result = await this.executeAsync(async () => {
      const response = await this.apiClient.userBoards_MoveCard(
        userId,
        boardId,
        cardId,
        command
      );

      if (response.result?.data) {
        const movedCard = new CardDto({
          id: response.result.data.id,
          boardColumnId: response.result.data.boardColumnId,
          description: response.result.data.description,
          order: response.result.data.order,
          assignedUserId: response.result.data.assignedUserId,
          assignedUser: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return movedCard;
      }

      return null;
    }, 'Failed to move card');

    return result || null;
  }

  selectCard(card: CardDto | null): void {
    runInAction(() => {
      this.selectedCard = card;
    });
  }

  override reset(): void {
    super.reset();
    runInAction(() => {
      this.cards = [];
      this.selectedCard = null;
    });
  }
}

export const cardStore = new CardStore();
