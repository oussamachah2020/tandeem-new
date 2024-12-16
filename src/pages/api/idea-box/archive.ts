import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: ideaDto} = payload
        return await ideaBoxService.archiveOne({...ideaDto, customerId: user.customer?.id})
    })