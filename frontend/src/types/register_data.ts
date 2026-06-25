import { Role } from "./enum";

export type RegisterData = {
  role: Role;
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  merchant_name: string;
  category: string;
  desc: string;
  location: string;
  address: string;
  phone: string;
  latitude?: number | null;
  longitude?: number | null;
};