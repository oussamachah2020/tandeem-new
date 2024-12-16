import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import publicationService from "@/domain/publications/services/PublicationService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await publicationService.deleteOne(payload.body.id);
    })