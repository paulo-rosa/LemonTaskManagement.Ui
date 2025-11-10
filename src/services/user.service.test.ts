/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from './user.service';
import { storageService } from './storage.service';

// Mock storageService
vi.mock('./storage.service', () => ({
  storageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset userService state
    userService.currentUser = null;
    userService.isAuthenticated = false;
  });

  describe('loadUserFromStorage', () => {
    it('should load user from storage on initialization', () => {
      const mockUser = { id: '123', username: 'testuser', email: 'test@example.com' };
      vi.mocked(storageService.getItem).mockReturnValue(mockUser);

      // Clear module cache and reimport to test constructor behavior
      vi.resetModules();
      // Create new service instance which triggers constructor
      const newService = new (userService.constructor as any)();

      expect(newService.currentUser).toEqual(mockUser);
      expect(newService.isAuthenticated).toBe(true);
    });

    it('should handle missing user in storage', () => {
      vi.mocked(storageService.getItem).mockReturnValue(null);

      // Create new service instance
      const newService = new (userService.constructor as any)();

      expect(newService.currentUser).toBeNull();
      expect(newService.isAuthenticated).toBe(false);
    });
  });

  describe('setCurrentUser', () => {
    it('should set user and persist to storage', () => {
      const mockUser = { id: '123', username: 'testuser', email: 'test@example.com' };

      userService.setCurrentUser(mockUser);

      expect(userService.currentUser).toEqual(mockUser);
      expect(userService.isAuthenticated).toBe(true);
      expect(storageService.setItem).toHaveBeenCalledWith('currentUser', mockUser);
    });

    it('should clear user and remove from storage when passed null', () => {
      userService.setCurrentUser(null);

      expect(userService.currentUser).toBeNull();
      expect(userService.isAuthenticated).toBe(false);
      expect(storageService.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('getCurrentUserId', () => {
    it('should return user id when user is set', () => {
      const mockUser = { id: '123', username: 'testuser', email: 'test@example.com' };
      userService.currentUser = mockUser;

      const userId = userService.getCurrentUserId();

      expect(userId).toBe('123');
    });

    it('should return null when no user is set', () => {
      userService.currentUser = null;

      const userId = userService.getCurrentUserId();

      expect(userId).toBeNull();
    });
  });

  describe('clearCurrentUser', () => {
    it('should clear user and remove from storage', () => {
      const mockUser = { id: '123', username: 'testuser' };
      userService.currentUser = mockUser;
      userService.isAuthenticated = true;

      userService.clearCurrentUser();

      expect(userService.currentUser).toBeNull();
      expect(userService.isAuthenticated).toBe(false);
      expect(storageService.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('checkAuth', () => {
    it('should return true when user is authenticated', () => {
      userService.currentUser = { id: '123', username: 'testuser' };
      userService.isAuthenticated = true;

      const result = userService.checkAuth();

      expect(result).toBe(true);
    });

    it('should return false when not authenticated', () => {
      userService.currentUser = null;
      userService.isAuthenticated = false;

      const result = userService.checkAuth();

      expect(result).toBe(false);
    });

    it('should return false when authenticated but user is null', () => {
      userService.currentUser = null;
      userService.isAuthenticated = true;

      const result = userService.checkAuth();

      expect(result).toBe(false);
    });

    it('should return false when user exists but not authenticated', () => {
      userService.currentUser = { id: '123', username: 'testuser' };
      userService.isAuthenticated = false;

      const result = userService.checkAuth();

      expect(result).toBe(false);
    });
  });

  describe('MobX reactivity', () => {
    it('should update observables when setting current user', () => {
      const mockUser = { id: '123', username: 'testuser' };

      userService.setCurrentUser(mockUser);

      expect(userService.currentUser).toEqual(mockUser);
      expect(userService.isAuthenticated).toBe(true);
    });

    it('should maintain observable state across multiple operations', () => {
      const user1 = { id: '1', username: 'user1' };
      const user2 = { id: '2', username: 'user2' };

      userService.setCurrentUser(user1);
      expect(userService.getCurrentUserId()).toBe('1');

      userService.setCurrentUser(user2);
      expect(userService.getCurrentUserId()).toBe('2');

      userService.clearCurrentUser();
      expect(userService.getCurrentUserId()).toBeNull();
    });
  });
});
