export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface TattooService {
  id?: number;
  name: string;
  description: string;
  imageBase64?: string;
  price?: number;
  createdAt?: string;
}

export interface PortfolioItem {
  id?: number;
  imageBase64: string;
  description: string;
  price: number;
  size: string;
  favoritesCount?: number;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
