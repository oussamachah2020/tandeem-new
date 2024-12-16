import {CustomerCreateDto, CustomerCreateFilesDto} from "@/domain/customers/dtos/CustomerCreateDto";

export interface CustomerUpdateDto extends Omit<CustomerCreateDto, 'contractFrom' | 'contractTo' | 'email'> {
    id: string
    logoRef: string
}

export type CustomerUpdateFilesDto = Partial<Omit<CustomerCreateFilesDto, 'contractScan'>>