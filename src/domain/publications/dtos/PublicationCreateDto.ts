import {Blob} from "buffer";

export interface PublicationCreateDto {
  title: string;
  content: string;
  photos: string[];
  pinned?: boolean;
  spotlight?: boolean;
  customerId?: string;
  coverUrl?: string;
}

export interface PublicationCreateFilesDto {
    image: Blob
}