import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import adminService from "@/domain/admins/services/AdminService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string }>(req, res, async (payload) => {
        return await adminService.toggleActive(payload.body.id, true);
    })