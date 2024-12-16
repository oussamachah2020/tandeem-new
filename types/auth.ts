import { Customer, Employee, Role } from "@prisma/client";

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  customer: Customer | null;
  employee: Employee | null;
};

export interface Payload {
  id: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}
