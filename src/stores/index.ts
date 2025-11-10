import { createContext, useContext } from 'react';
import { userStore } from './user.store';
import { boardStore } from './board.store';
import { taskStore } from './task.store';

// Root store containing all domain stores
class RootStore {
  userStore = userStore;
  boardStore = boardStore;
  taskStore = taskStore; // Kept for backwards compatibility with existing tests

  /**
   * Reset all stores
   */
  reset(): void {
    this.userStore.reset();
    this.boardStore.reset();
    this.taskStore.reset();
  }
}

// Create singleton instance
const rootStore = new RootStore();

const StoreContext = createContext<RootStore>(rootStore);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

export { StoreContext, rootStore };
export { userStore } from './user.store';
export { boardStore } from './board.store';
export { taskStore } from './task.store';
