import { makeAutoObservable } from 'mobx';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

class TaskStore {
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  updateTask(id: string, updates: Partial<Task>) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
    }
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  toggleTaskCompletion(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  reset() {
    this.tasks = [];
    this.loading = false;
    this.error = null;
  }

  // Computed values
  get completedTasks() {
    return this.tasks.filter((task) => task.completed);
  }

  get incompleteTasks() {
    return this.tasks.filter((task) => !task.completed);
  }

  get taskCount() {
    return this.tasks.length;
  }
}

export const taskStore = new TaskStore();
