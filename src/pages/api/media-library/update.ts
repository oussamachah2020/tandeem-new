import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import {MediaDto} from "@/domain/media-library/dto/MediaDto";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<MediaDto & { id: string }>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: mediaDto} = payload
        return await mediaLibraryService.updateOne({...mediaDto, customerId: user.customer?.id})
    })