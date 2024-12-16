import {CustomerUpdateDto} from "@/domain/customers/dtos/CustomerUpdateDto";
import {PaymentMethod} from "@prisma/client";
import {PartnerCreateFilesDto} from "@/domain/partners/dtos/PartnerCreateDto";

export interface PartnerUpdateDto extends CustomerUpdateDto {
    accepts?: PaymentMethod
}

export type PartnerUpdateFilesDto = Partial<Omit<PartnerCreateFilesDto, 'contractScan'>>