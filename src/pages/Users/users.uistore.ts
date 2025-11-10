import { makeAutoObservable, runInAction } from 'mobx';
import { userStore } from '../../stores';
import type { UserDto } from '../../api/LemonTaskManagementApiClient';

export class UsersPageUIStore {
  searchTerm = '';
  selectedUserId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /**
   * Initialize the page
   */
  async init(): Promise<void> {
    await this.loadUsers();
  }

  /**
   * Load users with current search term
   */
  async loadUsers(): Promise<void> {
    await userStore.loadUsers(this.searchTerm, undefined, 0, 50);
  }

  /**
   * Set search term and reload users
   */
  async setSearchTerm(term: string): Promise<void> {
    runInAction(() => {
      this.searchTerm = term;
    });
    await this.loadUsers();
  }

  /**
   * Select a user
   */
  selectUser(user: UserDto): void {
    runInAction(() => {
      this.selectedUserId = user.id || null;
    });
    userStore.selectUser(user);
  }

  /**
   * Get whether loading
   */
  get isLoading(): boolean {
    return userStore.loading;
  }

  /**
   * Get error
   */
  get error(): string | null {
    return userStore.error;
  }

  /**
   * Get users list
   */
  get users(): UserDto[] {
    return userStore.users;
  }
}
