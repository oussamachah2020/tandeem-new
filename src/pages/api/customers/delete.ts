import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import customerService from "@/domain/customers/services/CustomerService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await customerService.deleteOne(payload.body.id);
    })