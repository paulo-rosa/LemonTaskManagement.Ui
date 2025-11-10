/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BoardStore } from './board.store';
import type { BoardDto, UserBoardDto } from '../api/LemonTaskManagementApiClient';

// Mock the API client before any imports
vi.mock('../api/api.interceptor', () => ({
  apiClient: {
    userBoards_GetUserBoards: vi.fn(),
    userBoards_GetUserBoard: vi.fn(),
  },
}));

describe('BoardStore', () => {
  let store: BoardStore;
  let mockApiClient: any;

  beforeEach(async () => {
    store = new BoardStore();
    // Get the mocked client
    const { apiClient } = await import('../api/api.interceptor');
    mockApiClient = apiClient;
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(store.boards).toEqual([]);
      expect(store.selectedBoard).toBeNull();
      expect(store.currentUserId).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('loadBoardsForUser', () => {
    it('should load and filter boards for a user', async () => {
      const mockBoards: Partial<BoardDto>[] = [
        { id: '1', name: 'Board 1', description: 'Description 1', createdAt: new Date(), columns: [] },
        { id: '2', name: 'Board 2', description: 'Description 2', createdAt: new Date(), columns: [] },
      ];

      const mockUserBoards: Partial<UserBoardDto>[] = [
        { userId: 'user1', boardId: '1', board: mockBoards[0] as BoardDto, createdAt: new Date() },
        { userId: 'user1', boardId: '2', board: mockBoards[1] as BoardDto, createdAt: new Date() },
      ];

      mockApiClient.userBoards_GetUserBoards.mockResolvedValue({
        result: { data: mockUserBoards },
      });

      await store.loadBoardsForUser('user1', 0, 50);

      expect(mockApiClient.userBoards_GetUserBoards).toHaveBeenCalledWith('user1', 'user1', 0, 50);
      expect(store.boards).toEqual(mockBoards);
      expect(store.currentUserId).toBe('user1');
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle boards with undefined board property', async () => {
      const mockBoard: Partial<BoardDto> = {
        id: '1',
        name: 'Board 1',
        createdAt: new Date(),
        columns: [],
      };

      const mockUserBoards: Partial<UserBoardDto>[] = [
        { userId: 'user1', boardId: '1', board: mockBoard as BoardDto, createdAt: new Date() },
        { userId: 'user1', boardId: '2', board: undefined, createdAt: new Date() }, // undefined board
      ];

      mockApiClient.userBoards_GetUserBoards.mockResolvedValue({
        result: { data: mockUserBoards },
      });

      await store.loadBoardsForUser('user1', 0, 50);

      expect(store.boards).toEqual([mockBoard]);
      expect(store.boards.length).toBe(1);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockApiClient.userBoards_GetUserBoards.mockRejectedValue(mockError);

      await store.loadBoardsForUser('user1', 0, 50);

      expect(store.boards).toEqual([]);
      expect(store.error).toBe('Failed to load boards');
      expect(store.loading).toBe(false);
    });

    it('should handle empty response', async () => {
      mockApiClient.userBoards_GetUserBoards.mockResolvedValue({
        result: { data: [] },
      });

      await store.loadBoardsForUser('user1', 0, 50);

      expect(store.boards).toEqual([]);
      expect(store.currentUserId).toBe('user1');
    });

    it('should support pagination parameters', async () => {
      mockApiClient.userBoards_GetUserBoards.mockResolvedValue({
        result: { data: [] },
      });

      await store.loadBoardsForUser('user1', 10, 20);

      expect(mockApiClient.userBoards_GetUserBoards).toHaveBeenCalledWith('user1', 'user1', 10, 20);
    });
  });

  describe('loadBoard', () => {
    it('should load a specific board with details', async () => {
      const mockBoard: Partial<BoardDto> = {
        id: 'board1',
        name: 'Test Board',
        description: 'Test Description',
        createdAt: new Date(),
        columns: [
          {
            id: 'col1',
            boardId: 'board1',
            name: 'To Do',
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [],
          } as any,
        ],
      };

      mockApiClient.userBoards_GetUserBoard.mockResolvedValue({
        result: {
          data: {
            userId: 'user1',
            boardId: 'board1',
            board: mockBoard as BoardDto,
            createdAt: new Date(),
          },
        },
      });

      await store.loadBoard('user1', 'board1');

      expect(mockApiClient.userBoards_GetUserBoard).toHaveBeenCalledWith('user1', 'board1');
      expect(store.selectedBoard).toEqual(mockBoard);
      expect(store.selectedBoard?.columns?.length).toBe(1);
      expect(store.loading).toBe(false);
    });

    it('should handle missing board in response', async () => {
      mockApiClient.userBoards_GetUserBoard.mockResolvedValue({
        result: {
          data: {
            userId: 'user1',
            boardId: 'board1',
            board: undefined,
          },
        },
      });

      await store.loadBoard('user1', 'board1');

      expect(store.selectedBoard).toBeNull();
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Board not found');
      mockApiClient.userBoards_GetUserBoard.mockRejectedValue(mockError);

      await store.loadBoard('user1', 'board1');

      expect(store.selectedBoard).toBeNull();
      expect(store.error).toBe('Failed to load board');
      expect(store.loading).toBe(false);
    });
  });

  describe('selectBoard', () => {
    it('should allow selecting null', () => {
      const mockBoard = {
        id: '1',
        name: 'Test Board',
        createdAt: new Date(),
        columns: [],
      } as BoardDto;

      store.selectBoard(mockBoard);
      store.selectBoard(null);

      expect(store.selectedBoard).toBeNull();
    });
  });

  describe('clearSelectedBoard', () => {
    it('should clear the selected board', () => {
      const mockBoard = {
        id: '1',
        name: 'Test Board',
        createdAt: new Date(),
        columns: [],
      } as BoardDto;

      store.selectBoard(mockBoard);
      expect(store.selectedBoard).not.toBeNull();

      store.clearSelectedBoard();

      expect(store.selectedBoard).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all store state', async () => {
      // Set up some state
      store.boards = [
        { id: '1', name: 'Board 1', createdAt: new Date(), columns: [] } as BoardDto,
      ];
      store.selectedBoard = { id: '1', name: 'Board 1', createdAt: new Date(), columns: [] } as BoardDto;
      store.currentUserId = 'user1';

      // Simulate error state
      mockApiClient.userBoards_GetUserBoards.mockRejectedValue(new Error('Test error'));
      await store.loadBoardsForUser('user1');

      expect(store.error).not.toBeNull();

      // Reset
      store.reset();

      expect(store.boards).toEqual([]);
      expect(store.selectedBoard).toBeNull();
      expect(store.currentUserId).toBeNull();
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('loading state', () => {
    it('should set loading during API call', async () => {
      let resolvePromise: (value: { result: { data: unknown[] } }) => void;
      const promise = new Promise<{ result: { data: unknown[] } }>((resolve) => {
        resolvePromise = resolve;
      });

      mockApiClient.userBoards_GetUserBoards.mockReturnValue(promise);

      const loadPromise = store.loadBoardsForUser('user1');

      // Check loading state before resolution
      expect(store.loading).toBe(true);

      // Resolve the promise
      resolvePromise({ result: { data: [] } });
      await loadPromise;

      // Check loading state after resolution
      expect(store.loading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous errors on successful call', async () => {
      // First call fails
      mockApiClient.userBoards_GetUserBoards.mockRejectedValue(new Error('First error'));
      await store.loadBoardsForUser('user1');
      expect(store.error).not.toBeNull();

      // Second call succeeds
      mockApiClient.userBoards_GetUserBoards.mockResolvedValue({
        result: { data: [] },
      });
      await store.loadBoardsForUser('user1');

      expect(store.error).toBeNull();
    });
  });
});
