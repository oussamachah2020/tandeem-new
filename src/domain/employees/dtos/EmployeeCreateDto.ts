import {Blob} from "buffer";
import {JobLevel} from "@prisma/client";

export interface EmployeeCreateDto {
  customerId: string;
  firstName: string;
  lastName: string;
  registration: string;
  email: string;
  phone: string;
  departmentId?: string;
  departmentName?: string;
  level: JobLevel;
  photoUrl: string;
  fcmToken: string;
}

export interface EmployeeCreateFilesDto {
    photo: Blob
}