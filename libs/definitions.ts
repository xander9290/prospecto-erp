export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Partner {
  id: string;
  name: string;
  email: string | null;
  Users: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  userName: string;
  password: string;
  email: string;
  imageUrl: string | null;
  imageId: string | null;
  lastLogin: string | null;
  Partner: Partner;
  partnerId: string;
  Request: Request | null;
  requestId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: String;
  name: string;
  email: string;
  accepted: boolean;
  Users: User | null;
  createdAt: Date;
  updatedAt: Date;
}
