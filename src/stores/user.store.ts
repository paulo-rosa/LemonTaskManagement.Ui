import { makeObservable, observable, runInAction } from 'mobx';
import { BaseStore } from './base.store';
import type { UserDto } from '../api/LemonTaskManagementApiClient';

export class UserStore extends BaseStore {
  users: UserDto[] = [];
  selectedUser: UserDto | null = null;
  totalCount = 0;

  constructor() {
    super();
    makeObservable(this, {
      users: observable,
      selectedUser: observable,
      totalCount: observable,
    });
  }

  /**
   * Load all users with optional filtering and pagination
   */
  async loadUsers(
    nameContains?: string,
    emailContains?: string,
    skip = 0,
    take = 50
  ): Promise<void> {
    await this.executeAsync(async () => {
      const response = await this.apiClient.users_GetUsers(
        nameContains || null,
        emailContains || null,
        skip,
        take
      );

      runInAction(() => {
        if (response.result?.data) {
          this.users = response.result.data;
          this.totalCount = response.result.data.length;
        }
      });
    }, 'Failed to load users');
  }

  /**
   * Load a specific user by ID
   */
  async loadUser(userId: string): Promise<void> {
    await this.executeAsync(async () => {
      const response = await this.apiClient.users_GetUser(userId);

      runInAction(() => {
        if (response.result?.data) {
          this.selectedUser = response.result.data;
        }
      });
    }, 'Failed to load user');
  }

  /**
   * Select a user
   */
  selectUser(user: UserDto | null): void {
    runInAction(() => {
      this.selectedUser = user;
    });
  }

  /**
   * Clear selected user
   */
  clearSelectedUser(): void {
    this.selectUser(null);
  }

  /**
   * Reset store
   */
  override reset(): void {
    super.reset();
    runInAction(() => {
      this.users = [];
      this.selectedUser = null;
      this.totalCount = 0;
    });
  }
}

// Export singleton instance
export const userStore = new UserStore();
