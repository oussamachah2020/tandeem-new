import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import adminService from "@/domain/admins/services/AdminService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{ id: string, refs?: string | string[] }>(req, res, async (payload) => {
            return await adminService.deleteOne({
                ...payload.body,
                refs: payload.body.refs
                    ? Array.isArray(payload.body.refs) ? payload.body.refs : [payload.body.refs]
                    : undefined
            });
        }
    )