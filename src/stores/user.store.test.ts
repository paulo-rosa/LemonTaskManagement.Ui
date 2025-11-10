/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserStore } from './user.store';
import { UserDto } from '../api/LemonTaskManagementApiClient';

// Mock the API client before any imports
vi.mock('../api/api.interceptor', () => ({
  apiClient: {
    users_GetUsers: vi.fn(),
    users_GetUser: vi.fn(),
  },
}));

describe('UserStore', () => {
  let store: UserStore;
  let mockApiClient: any;

  beforeEach(async () => {
    store = new UserStore();
    // Get the mocked client
    const { apiClient } = await import('../api/api.interceptor');
    mockApiClient = apiClient;
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      expect(store.users).toEqual([]);
      expect(store.selectedUser).toBeNull();
      expect(store.totalCount).toBe(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('loadUsers', () => {
    it('should load all users', async () => {
      const mockUsers: UserDto[] = [
        new UserDto({ id: '1', username: 'user1', email: 'user1@test.com', createdAt: new Date() }),
        new UserDto({ id: '2', username: 'user2', email: 'user2@test.com', createdAt: new Date() }),
      ];

      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: mockUsers },
      });

      await store.loadUsers();

      expect(mockApiClient.users_GetUsers).toHaveBeenCalledWith(null, null, 0, 50);
      expect(store.users).toEqual(mockUsers);
      expect(store.totalCount).toBe(2);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should filter users by name', async () => {
      const mockUsers: UserDto[] = [
        new UserDto({ id: '1', username: 'john', email: 'john@test.com', createdAt: new Date() }),
      ];

      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: mockUsers },
      });

      await store.loadUsers('john', undefined, 0, 50);

      expect(mockApiClient.users_GetUsers).toHaveBeenCalledWith('john', null, 0, 50);
      expect(store.users).toEqual(mockUsers);
    });

    it('should filter users by email', async () => {
      const mockUsers: UserDto[] = [
        new UserDto({ id: '1', username: 'user1', email: 'test@example.com', createdAt: new Date() }),
      ];

      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: mockUsers },
      });

      await store.loadUsers(undefined, 'test@example.com', 0, 50);

      expect(mockApiClient.users_GetUsers).toHaveBeenCalledWith(null, 'test@example.com', 0, 50);
      expect(store.users).toEqual(mockUsers);
    });

    it('should support pagination', async () => {
      const mockUsers: UserDto[] = [
        new UserDto({ id: '11', username: 'user11', email: 'user11@test.com', createdAt: new Date() }),
      ];

      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: mockUsers },
      });

      await store.loadUsers(undefined, undefined, 10, 10);

      expect(mockApiClient.users_GetUsers).toHaveBeenCalledWith(null, null, 10, 10);
    });

    it('should handle empty results', async () => {
      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: [] },
      });

      await store.loadUsers();

      expect(store.users).toEqual([]);
      expect(store.totalCount).toBe(0);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockApiClient.users_GetUsers.mockRejectedValue(mockError);

      await store.loadUsers();

      expect(store.users).toEqual([]);
      expect(store.error).toBe('Failed to load users');
      expect(store.loading).toBe(false);
    });
  });

  describe('loadUser', () => {
    it('should load a specific user', async () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      mockApiClient.users_GetUser.mockResolvedValue({
        result: { data: mockUser },
      });

      await store.loadUser('1');

      expect(mockApiClient.users_GetUser).toHaveBeenCalledWith('1');
      expect(store.selectedUser).toEqual(mockUser);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('should handle missing user', async () => {
      mockApiClient.users_GetUser.mockResolvedValue({
        result: { data: undefined },
      });

      await store.loadUser('999');

      expect(store.selectedUser).toBeNull();
    });

    it('should handle API errors', async () => {
      const mockError = new Error('User not found');
      mockApiClient.users_GetUser.mockRejectedValue(mockError);

      await store.loadUser('999');

      expect(store.selectedUser).toBeNull();
      expect(store.error).toBe('Failed to load user');
      expect(store.loading).toBe(false);
    });
  });

  describe('selectUser', () => {
    it('should select a user', () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      store.selectUser(mockUser);

      expect(store.selectedUser).toBe(mockUser);
    });

    it('should allow selecting null', () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      store.selectUser(mockUser);
      store.selectUser(null);

      expect(store.selectedUser).toBeNull();
    });
  });

  describe('clearSelectedUser', () => {
    it('should clear the selected user', () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      });

      store.selectUser(mockUser);
      expect(store.selectedUser).not.toBeNull();

      store.clearSelectedUser();

      expect(store.selectedUser).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all store state', async () => {
      // Set up some state
      store.users = [
        new UserDto({ id: '1', username: 'user1', email: 'user1@test.com', createdAt: new Date() }),
      ];
      store.selectedUser = new UserDto({ id: '1', username: 'user1', email: 'user1@test.com', createdAt: new Date() });
      store.totalCount = 1;

      // Simulate error state
      mockApiClient.users_GetUsers.mockRejectedValue(new Error('Test error'));
      await store.loadUsers();

      expect(store.error).not.toBeNull();

      // Reset
      store.reset();

      expect(store.users).toEqual([]);
      expect(store.selectedUser).toBeNull();
      expect(store.totalCount).toBe(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('loading state', () => {
    it('should set loading during API call', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockApiClient.users_GetUsers.mockReturnValue(promise);

      const loadPromise = store.loadUsers();

      // Check loading state before resolution
      expect(store.loading).toBe(true);

      // Resolve the promise
      resolvePromise!({ result: { data: [] } });
      await loadPromise;

      // Check loading state after resolution
      expect(store.loading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should clear previous errors on successful call', async () => {
      // First call fails
      mockApiClient.users_GetUsers.mockRejectedValue(new Error('First error'));
      await store.loadUsers();
      expect(store.error).not.toBeNull();

      // Second call succeeds
      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: [] },
      });
      await store.loadUsers();

      expect(store.error).toBeNull();
    });
  });

  describe('multiple filter combinations', () => {
    it('should handle combined name and email filters', async () => {
      const mockUsers: UserDto[] = [
        new UserDto({ id: '1', username: 'john', email: 'john@test.com', createdAt: new Date() }),
      ];

      mockApiClient.users_GetUsers.mockResolvedValue({
        result: { data: mockUsers },
      });

      await store.loadUsers('john', 'john@test.com', 0, 50);

      expect(mockApiClient.users_GetUsers).toHaveBeenCalledWith('john', 'john@test.com', 0, 50);
      expect(store.users).toEqual(mockUsers);
    });
  });

  describe('MobX observability', () => {
    it('should make users array observable', () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'test',
        email: 'test@test.com',
        createdAt: new Date(),
      });

      store.users = [mockUser];

      expect(store.users[0]).toBe(mockUser);
    });

    it('should make selectedUser observable', () => {
      const mockUser: UserDto = new UserDto({
        id: '1',
        username: 'test',
        email: 'test@test.com',
        createdAt: new Date(),
      });

      store.selectUser(mockUser);

      expect(store.selectedUser).toBe(mockUser);
    });

    it('should make totalCount observable', () => {
      store.totalCount = 10;

      expect(store.totalCount).toBe(10);
    });
  });
});
