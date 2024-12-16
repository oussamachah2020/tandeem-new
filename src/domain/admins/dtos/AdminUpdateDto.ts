import {Blob} from "buffer";

export interface AdminUpdateDto {
    adminId: string
    photoRef: string
    name: string
}

export interface AdminUpdateFilesDto {
    photo?: Blob
}