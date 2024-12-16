import fileService from "@/common/services/FileService";
import prisma from "@/common/libs/prisma";
import {PublicationCreateDto, PublicationCreateFilesDto} from "@/domain/publications/dtos/PublicationCreateDto";
import {PublicationUpdateDto, PublicationUpdateFilesDto} from "@/domain/publications/dtos/PublicationUpdateDto";
import staticValues from "@/common/context/StaticValues";

class PublicationService {
    getAll = async (customerId?: string) =>
        prisma
            .publication
            .findMany({
                where: customerId
                    ? {customerId}
                    : {
                        customer: {
                            is: null
                        }
                    },
                orderBy: [
                    { pinned: 'desc' },
                    { createdAt: 'desc' }
                ]
            });

    addOne = async (publicationDto: PublicationCreateDto & PublicationCreateFilesDto): Promise<keyof typeof staticValues.notification> => {
        const imageRef = await fileService.save('publications', publicationDto.image)
        await prisma
            .publication
            .create({
                data: {
                    title: publicationDto.title,
                    content: publicationDto.content,
                    pinned: publicationDto.pinned !== undefined,
                    photo: imageRef,
                    customerId: publicationDto.customerId ?? null
                }
            })
        return 'publicationAddedSuccess'
    };

    updateOne = async (publicationDto: PublicationUpdateDto & PublicationUpdateFilesDto): Promise<keyof typeof staticValues.notification> => {
        if (publicationDto.image) await fileService.replace(publicationDto.imageRef, publicationDto.image)
        await prisma
            .publication
            .update({
                data: {
                    title: publicationDto.title,
                    content: publicationDto.content,
                    pinned: publicationDto.pinned !== undefined,
                },
                where: publicationDto.customerId
                    ? {id: publicationDto.id, customerId: publicationDto.customerId}
                    : {id: publicationDto.id}
            });
        return 'publicationUpdatedSuccess'
    };

    deleteOne = async (id: string): Promise<keyof typeof staticValues.notification> => {
        await prisma.publication.delete({where: {id}})
        return 'publicationDeletedSuccess'
    }
}

let publicationService: PublicationService;

if (process.env.NODE_ENV === 'production') publicationService = new PublicationService();
else {
    if (!global.publicationService) global.publicationService = new PublicationService();
    publicationService = global.publicationService;
}
export default publicationService;