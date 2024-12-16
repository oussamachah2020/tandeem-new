import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import publicationService from "@/domain/publications/services/PublicationService";
import {PublicationCreateDto, PublicationCreateFilesDto} from "@/domain/publications/dtos/PublicationCreateDto";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<PublicationCreateDto, PublicationCreateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: publicationCreateDto, files: {image}} = payload
        return await publicationService.addOne({...publicationCreateDto, image, customerId: user.customer?.id})
    }, ['image'])

export const config = {
    api: {
        bodyParser: false,
    }
};
