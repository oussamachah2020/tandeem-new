import {Blob} from "buffer";

export interface ContractUpdateDto {
    id: string
    scanRef: string
    from: string
    prematureTo?: string
    to: string
}

export interface EditContractFilesDto {
    scan?: Blob,
}