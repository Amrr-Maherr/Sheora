import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "@/constants/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ApiClient {
  private http: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.http = axios.create({
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }

  private async request<T>(promise: Promise<{ data: T }>): Promise<T> {
    try {
      const { data } = await promise;
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message ?? error.message,
          error.response?.status ?? 0,
        );
      }
      throw error;
    }
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(this.http.get(path));
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(this.http.post(path, body));
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(this.http.put(path, body));
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(this.http.patch(path, body));
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(this.http.delete(path));
  }
}

export const apiClient = new ApiClient();