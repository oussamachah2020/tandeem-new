import {Blob} from "buffer";

export interface PublicationCreateDto {
    title: string
    content: string
    pinned?: string
    customerId?: string
}

export interface PublicationCreateFilesDto {
    image: Blob
}