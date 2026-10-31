import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { LARAVEL_API_BASE_URL } from "@/constants/api";
import { ApiError } from "./client";
import { getAuthToken } from "@/lib/authStorage";

export type LaravelPaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type LaravelPaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type LaravelCollection<T> = {
  success: boolean;
  message?: string;
  data: T[];
  meta: LaravelPaginationMeta;
  links: LaravelPaginationLinks;
};

export type LaravelEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export class LaravelApiClient {
  private http: AxiosInstance;

  constructor(baseUrl: string = LARAVEL_API_BASE_URL) {
    this.http = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Automatically inject Bearer token if present
    this.http.interceptors.request.use((config) => {
      const token = getAuthToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (!config.headers["Accept-Language"] && typeof document !== "undefined") {
        config.headers["Accept-Language"] =
          document.documentElement.lang || "ar";
      }

      return config;
    });
  }

  private async request<T>(promise: Promise<{ data: T }>): Promise<T> {
    try {
      const { data } = await promise;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data?.error;
        const message =
          errorData?.message ??
          error.response?.data?.message ??
          error.message;
        const code = errorData?.code;
        const status = error.response?.status ?? 0;

        throw new ApiError(message, status, code);
      }
      throw error;
    }
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const envelope = await this.request<LaravelEnvelope<T>>(
      this.http.get(path, config),
    );
    return envelope.data;
  }

  async post<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const envelope = await this.request<LaravelEnvelope<T>>(
      this.http.post(path, body, config),
    );
    return envelope.data;
  }

  async patch<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const envelope = await this.request<LaravelEnvelope<T>>(
      this.http.patch(path, body, config),
    );
    return envelope.data;
  }

  async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const envelope = await this.request<LaravelEnvelope<T>>(
      this.http.delete(path, config),
    );
    return envelope.data;
  }

  getCollection<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<LaravelCollection<T>> {
    return this.request<LaravelCollection<T>>(this.http.get(path, config));
  }
}

export const laravelApiClient = new LaravelApiClient();
