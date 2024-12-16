import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import authService from "@/common/services/AuthService";

interface Request {
    token: string,
    password: string
}

export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<Request>(req, res, async ({body: {token, password}}) => {
        return await authService.resetPassword(token, password);
    }, null, {redirectTo: '/login'})