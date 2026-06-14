import type { Role } from "./enum";

export type Profile = {
  user_id: string;
  full_name: string | null;
  role: Role;
};
