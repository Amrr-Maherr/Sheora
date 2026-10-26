import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { LARAVEL_API_BASE_URL } from "@/constants/api";
import { ApiError } from "./client";

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

type LaravelEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export class LaravelApiClient {
  private http: AxiosInstance;

  constructor(baseUrl: string = LARAVEL_API_BASE_URL) {
    this.http = axios.create({
      baseURL: baseUrl,
      headers: { Accept: "application/json" },
    });
  }

  private async request<T>(promise: Promise<{ data: T }>): Promise<T> {
    try {
      const { data } = await promise;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.error?.message ??
            error.response?.data?.message ??
            error.message,
          error.response?.status ?? 0,
        );
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

  getCollection<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<LaravelCollection<T>> {
    return this.request<LaravelCollection<T>>(this.http.get(path, config));
  }
}

export const laravelApiClient = new LaravelApiClient();
