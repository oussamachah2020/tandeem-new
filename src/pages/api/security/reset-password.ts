// import {handle} from "@/apiMiddleware";
// import {NextApiRequest, NextApiResponse} from "next";
// import authService from "@/common/services/AuthService";

// interface Request {
//     token: string,
//     password: string
// }

// export default async (req: NextApiRequest, res: NextApiResponse) =>
//     handle<Request>(req, res, async ({body: {token, password}}) => {
//         return await authService.resetPassword(token, password);
//     }, null, {redirectTo: '/login'})

import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req?.user;

  if (!user) {
    redirect("/login");
  }

  const { token, password } = req.body;
  return await authService.resetPassword(token, password);
}

export default authMiddleware(handler);
