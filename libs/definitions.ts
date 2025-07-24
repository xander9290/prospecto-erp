import { Partner, User, Image } from "@/generate/prisma";

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

export interface PartnerWithAttrs extends Partner {
  Image: Image | null;
  CreateUid: User | null;
}

export interface PartnerContacts extends PartnerWithAttrs {
  UserId: User | null;
}

export interface UserWithPartner extends User {
  Partner: PartnerWithAttrs;
}

export interface Request {
  id: String;
  name: string;
  email: string;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
