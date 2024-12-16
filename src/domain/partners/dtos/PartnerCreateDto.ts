import { $Enums } from "@prisma/client";
import { Category } from "@prisma/client";
import { Blob } from "buffer";
import PaymentMethod = $Enums.PaymentMethod;

export interface PartnerCreateDto {
  name: string;
  address: string;
  website: string;
  category: Category;
  contractFrom: string;
  contractTo: string;
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  accepts: PaymentMethod;
}

export interface PartnerCreateFilesDto {
  logo: Blob;
  contractScan: Blob;
}
