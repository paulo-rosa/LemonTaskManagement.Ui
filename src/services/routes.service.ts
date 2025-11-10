import { makeAutoObservable } from 'mobx';

class RoutesService {
  currentPath = globalThis.location.pathname;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Navigate to a path
   */
  navigate(path: string): void {
    globalThis.history.pushState({}, '', path);
    this.currentPath = path;
  }

  /**
   * Replace current path
   */
  replace(path: string): void {
    globalThis.history.replaceState({}, '', path);
    this.currentPath = path;
  }

  /**
   * Go back in history
   */
  goBack(): void {
    globalThis.history.back();
  }

  /**
   * Go forward in history
   */
  goForward(): void {
    globalThis.history.forward();
  }

  /**
   * Build route with params
   */
  buildRoute(template: string, params: Record<string, string>): string {
    let route = template;
    for (const [key, value] of Object.entries(params)) {
      route = route.replace(`:${key}`, value);
    }
    return route;
  }
}

// Export singleton instance
export const routesService = new RoutesService();
