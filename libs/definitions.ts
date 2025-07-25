import { Partner, User } from "@/generate/prisma";

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

export interface UserWithPartner extends User {
  relatedPartner: Partner;
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
