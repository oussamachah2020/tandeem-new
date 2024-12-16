import prisma from "@/common/libs/prisma";
import {MediaDto} from "@/domain/media-library/dto/MediaDto";
import staticValues from "@/common/context/StaticValues";

class MediaLibraryService {
    getAll = async (customerId?: string) =>
        await prisma
            .mediaLibrary
            .findMany({
                where: customerId ? {customerId} : {customer: {is: null}}
            })

    async addOne(mediaCreateDto: MediaDto & { customerId?: string }): Promise<keyof typeof staticValues.notification> {
        const {title, description, url, customerId} = mediaCreateDto
        await prisma
            .mediaLibrary
            .create({data: {title, description, url, customerId}})
        return 'mediaAddedSuccess'
    }

    async updateOne(mediaUpdateDto: MediaDto & { id: string, customerId?: string }) {
        const {id, title, description, customerId, url} = mediaUpdateDto
        const media = await prisma
            .mediaLibrary
            .findUnique({
                where: {id},
                select: {customerId: true}
            })
        if (media && (media.customerId == customerId)) {
            await prisma
                .mediaLibrary
                .update({where: {id}, data: {title, description, url}})
        }
        return 'mediaUpdatedSuccess'
    }


    async deleteOne(mediaDeleteDto: { id: string, customerId?: string }): Promise<keyof typeof staticValues.notification> {
        const {id, customerId} = mediaDeleteDto
        const media = await prisma
            .mediaLibrary
            .findUnique({
                where: {id},
                select: {customerId: true}
            })
        if (!media) return 'resourceNotFound'
        if (media.customerId != customerId) return 'deleteActionNotPermitted'
        await prisma
            .mediaLibrary
            .delete({where: {id}})
        return 'mediaDeletedSuccess'
    }
}

let mediaLibraryService: MediaLibraryService;

if (process.env.NODE_ENV === 'production') mediaLibraryService = new MediaLibraryService();
else {
    if (!global.mediaLibraryService) global.mediaLibraryService = new MediaLibraryService();
    mediaLibraryService = global.mediaLibraryService;
}
export default mediaLibraryService;