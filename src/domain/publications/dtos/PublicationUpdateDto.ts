import {PublicationCreateDto, PublicationCreateFilesDto} from "@/domain/publications/dtos/PublicationCreateDto";

export interface PublicationUpdateDto extends PublicationCreateDto {
    id: string
    imageRef: string
}

export interface PublicationUpdateFilesDto extends Partial<PublicationCreateFilesDto> {
}