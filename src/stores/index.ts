import { createContext, useContext } from 'react';
import { userStore } from './user.store';
import { boardStore } from './board.store';
import { authStore } from './auth.store';
import { cardStore } from './card.store';

// Root store containing all domain stores
class RootStore {
  userStore = userStore;
  boardStore = boardStore;
  authStore = authStore;
  cardStore = cardStore;

  /**
   * Reset all stores
   */
  reset(): void {
    this.userStore.reset();
    this.boardStore.reset();
    this.authStore.reset();
    this.cardStore.reset();
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
export { authStore } from './auth.store';
export { cardStore } from './card.store';
