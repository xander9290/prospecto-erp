export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ModalBasicProps {
  show: boolean;
  onHide?: () => void;
  action?: () => void;
  string?: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  userName: string;
  password: string;
  email: string;
  imageUrl: string | null;
  lastLogin: Date | null;
  Partner: Partner;
  partnerId: string;
  state: string;
  darkMode: boolean;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageSource {
  id: string;
  url: string;
  publicId: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: String;
  name: string;
  email: string;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
