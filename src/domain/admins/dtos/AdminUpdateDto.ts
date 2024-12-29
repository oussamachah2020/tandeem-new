import {Blob} from "buffer";

export interface AdminUpdateDto {
  adminId: string;
  photoUrl: string;
  name: string;
}

export interface AdminUpdateFilesDto {
    photo?: Blob
}