import {Category} from "@prisma/client";
import {Blob} from "buffer";

export interface CustomerCreateDto {
  name: string;
  address: string;
  email: string;
  website: string;
  userId: string;
  addresses: string[];
  category: Category;
  maxEmployees: number;
  contractFrom: string;
  contractTo: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  logoUrl: string;
  contractScan: string;
}

export interface CustomerCreateFilesDto {
    logo: Blob,
    contractScan: Blob
}