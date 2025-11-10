import { makeObservable, observable, action, runInAction } from 'mobx';
import { apiClient } from '../api/api.interceptor';
import type { LemonTaskManagementApiClient } from '../api/LemonTaskManagementApiClient';

export abstract class BaseStore {
  protected apiClient: LemonTaskManagementApiClient;
  private lockCount = 0;

  loading = false;
  error: string | null = null;

  constructor() {
    this.apiClient = apiClient;
    makeObservable(this, {
      loading: observable,
      error: observable,
      reset: action,
    });
  }

  protected lock(): void {
    this.lockCount++;
    if (this.lockCount > 0) {
      this.loading = true;
    }
  }

  protected unlock(): void {
    this.lockCount = Math.max(0, this.lockCount - 1);
    if (this.lockCount === 0) {
      this.loading = false;
    }
  }

  protected setError(error: string | null): void {
    runInAction(() => {
      this.error = error;
    });
  }

  protected clearError(): void {
    this.setError(null);
  }

  protected handleError(error: unknown): void {
    console.error('Store error:', error);
    const errorMessage = this.extractErrorMessage(error);
    this.setError(errorMessage);
  }

  private extractErrorMessage(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'An unexpected error occurred';
    }

    if ('response' in error && error.response && typeof error.response === 'object') {
      if ('data' in error.response && error.response.data && typeof error.response.data === 'object') {
        if ('message' in error.response.data && typeof error.response.data.message === 'string') {
          return error.response.data.message;
        }
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  protected async executeAsync<T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> {
    this.lock();
    this.clearError();

    try {
      const result = await operation();
      return result;
    } catch (error) {
      this.handleError(error);
      if (errorMessage) {
        this.setError(errorMessage);
      }
      return null;
    } finally {
      this.unlock();
    }
  }

  reset(): void {
    runInAction(() => {
      this.loading = false;
      this.error = null;
      this.lockCount = 0;
    });
  }
}
