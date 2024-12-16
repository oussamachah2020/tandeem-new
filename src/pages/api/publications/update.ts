import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import publicationService from "@/domain/publications/services/PublicationService";
import {PublicationUpdateDto, PublicationUpdateFilesDto} from "@/domain/publications/dtos/PublicationUpdateDto";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<PublicationUpdateDto, PublicationUpdateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: publicationUpdateDto, files: {image}} = payload
        return await publicationService.updateOne({...publicationUpdateDto, image, customerId: user.customer?.id})
    }, ['image'])

export const config = {
    api: {
        bodyParser: false,
    }
};
