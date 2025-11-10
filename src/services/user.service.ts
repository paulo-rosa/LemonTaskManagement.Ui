import { makeAutoObservable } from 'mobx';
import { storageService } from './storage.service';

interface StoredUser {
  id: string;
  username?: string;
  email?: string;
}

class UserService {
  currentUser: StoredUser | null = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

  /**
   * Load user data from local storage
   */
  private loadUserFromStorage(): void {
    const userData = storageService.getItem<StoredUser>('currentUser');
    if (userData) {
      this.currentUser = userData;
      this.isAuthenticated = true;
    }
  }

  /**
   * Set current user and persist to storage
   */
  setCurrentUser(user: StoredUser | null): void {
    this.currentUser = user;
    this.isAuthenticated = !!user;
    
    if (user) {
      storageService.setItem('currentUser', user);
    } else {
      storageService.removeItem('currentUser');
    }
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  /**
   * Clear current user
   */
  clearCurrentUser(): void {
    this.setCurrentUser(null);
  }

  /**
   * Check if user is authenticated
   */
  checkAuth(): boolean {
    return this.isAuthenticated && !!this.currentUser;
  }
}

// Export singleton instance
export const userService = new UserService();
