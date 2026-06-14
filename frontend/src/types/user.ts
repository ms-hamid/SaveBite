import type { Role } from "./enum";

export type User = {
  id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  full_name: string;
  email: string;
  password: string;
  role: Role;
  is_suspended: boolean;
};
