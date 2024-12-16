import {Blob} from "buffer";

export interface AdminCreateDto {
    name: string
    email: string
    customerId?: string
}

export interface AdminCreateFilesDto {
    photo: Blob
}