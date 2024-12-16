import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import authService from "@/common/services/AuthService";

interface Request {
    oldPassword: string,
    newPassword: string
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<Request>(req, res, async ({body: {oldPassword, newPassword}}, useUser) => {
        const user = await useUser();
        return await authService.updatePassword(user.email, oldPassword, newPassword);
    })