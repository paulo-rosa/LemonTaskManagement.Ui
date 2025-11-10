import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { LemonTaskManagementApiClient } from './LemonTaskManagementApiClient';

class ApiInterceptor {
  private readonly axiosInstance: AxiosInstance;
  public apiClient: LemonTaskManagementApiClient;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data && 
            !('statusCode' in response.data) && 
            !('result' in response.data)) {
          response.data = {
            statusCode: response.status,
            message: null,
            exception: null,
            result: response.data
          };
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          globalThis.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    this.apiClient = new LemonTaskManagementApiClient(
      import.meta.env.VITE_API_BASE_URL,
      this.axiosInstance
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  getApiClient(): LemonTaskManagementApiClient {
    return this.apiClient;
  }
}

export const apiInterceptor = new ApiInterceptor();
export const apiClient = apiInterceptor.getApiClient();
