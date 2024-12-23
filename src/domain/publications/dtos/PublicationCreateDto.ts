import {Blob} from "buffer";

export interface PublicationCreateDto {
  title: string;
  content: string;
  photoUrl: string;
  pinned?: boolean;
  customerId?: string;
}

export interface PublicationCreateFilesDto {
    image: Blob
}