import {handle} from "@/apiMiddleware";
import {NextApiRequest, NextApiResponse} from "next";
import authService from "@/common/services/AuthService";


export default async (req: NextApiRequest, res: NextApiResponse) =>
    handle<{email: string}>(req, res, async (payload) => {
        const {email} = payload.body
        return await authService.createResetPasswordRequest(email)
    }, null, {redirectTo: '/login'})