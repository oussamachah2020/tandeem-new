import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: mediaDto} = payload
        return await mediaLibraryService.deleteOne({...mediaDto, customerId: user.customer?.id})
    })