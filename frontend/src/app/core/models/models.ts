export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'TATTOER';
  specialty?: string;
  experience?: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER'| 'TATTOER';
}

export interface TattooService {
  id?: number;
  name: string;
  description: string;
  imageBase64?: string;
  price?: number;
  duration?: number;
  type?: string;
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

/* ─── Carrito ─── */

export interface TattooServiceExtended {
  id: number;
  name: string;
  description: string;
  imageBase64?: string;
  price: number;
  duration: number;
  type: string;
}

export interface Tattoer {
  id: number;
  name: string;
  specialty?: string;
  experience?: number;
  avatar?: string;
}

export interface CartItem {
  service: TattooServiceExtended;
  tattoer: Tattoer;
  schedule: string;
  quantity: number;
}

export interface Appointment {
  id: string;
  tattoerId: number;
  tattoerName: string;
  userId: number;
  userName: string;
  serviceName: string;
  serviceType: string;
  schedule: string;
  duration: number;
  price: number;
}

  
