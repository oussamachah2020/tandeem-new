import {Blob} from "buffer";

export interface PublicationCreateDto {
  title: string;
  content: string;
  photos: string[];
  pinned?: boolean;
  customerId?: string;
}

export interface PublicationCreateFilesDto {
    image: Blob
}