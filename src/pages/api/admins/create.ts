import {NextApiRequest, NextApiResponse} from "next";
import {handle} from "@/apiMiddleware";
import {AdminCreateDto, AdminCreateFilesDto} from "@/domain/admins/dtos/AdminCreateDto";
import adminService from "@/domain/admins/services/AdminService";

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<AdminCreateDto, AdminCreateFilesDto>(req, res, async (payload, useUser) => {
        const user = await useUser()
        const {body: adminCreateDto, files: {photo}} = payload
        return await adminService.addOne({...adminCreateDto, photo, customerId: user.customer?.id})
    }, ['photo'])

export const config = {
    api: {
        bodyParser: false,
    }
};
