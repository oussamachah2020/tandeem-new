import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";
import {AdminUpdateDto, AdminUpdateFilesDto} from "@/domain/admins/dtos/AdminUpdateDto";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<AdminUpdateDto, AdminUpdateFilesDto>(req, res, async (payload) => {
        const {body: adminUpdateDto, files: {photo}} = payload
        return await adminService.updateOne({...adminUpdateDto, photo})
    }, ['photo'])

export const config = {
    api: {
        bodyParser: false,
    }
};
