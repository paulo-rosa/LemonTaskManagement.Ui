import { makeObservable, observable, action, runInAction } from 'mobx';
import { BaseStore } from './base.store';
import { LoginCommand, type LoginDto } from '../api/LemonTaskManagementApiClient';

export class AuthStore extends BaseStore {
  isAuthenticated = false;
  currentUser: LoginDto | null = null;
  token: string | null = null;

  constructor() {
    super();
    makeObservable(this, {
      isAuthenticated: observable,
      currentUser: observable,
      token: observable,
      login: action,
      logout: action,
      checkAuth: action,
    });

    // Check for existing auth on initialization
    this.checkAuth();
  }

  /**
   * Check if user is authenticated from storage
   */
  checkAuth(): void {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        runInAction(() => {
          this.token = token;
          this.currentUser = user;
          this.isAuthenticated = true;
        });
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        this.logout();
      }
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<boolean> {
    const command = new LoginCommand({
      username,
      password,
    });

    const success = await this.executeAsync(async () => {
      const response = await this.apiClient.authentication_Login(command);

      if (response.result?.data) {
        const loginData = response.result.data;

        runInAction(() => {
          this.token = loginData.token || null;
          this.currentUser = loginData;
          this.isAuthenticated = true;
        });

        // Store in localStorage
        if (loginData.token) {
          localStorage.setItem('authToken', loginData.token);
          localStorage.setItem('currentUser', JSON.stringify(loginData));
        }

        return true;
      }

      return false;
    }, 'Login failed');

    return success === true;
  }

  /**
   * Logout and clear authentication
   */
  logout(): void {
    runInAction(() => {
      this.token = null;
      this.currentUser = null;
      this.isAuthenticated = false;
    });

    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  /**
   * Reset store
   */
  override reset(): void {
    super.reset();
    this.logout();
  }
}

// Export singleton instance
export const authStore = new AuthStore();
