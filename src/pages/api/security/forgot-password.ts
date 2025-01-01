// import {handle} from "@/apiMiddleware";
// import {NextApiRequest, NextApiResponse} from "next";
// import authService from "@/common/services/AuthService";

import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import { redirect } from "next/navigation";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req?.user;

  if (!user) {
    redirect("/login");
  }

  const { email } = req.body;

  return await authService.createResetPasswordRequest(email);
}

export default authMiddleware(handler);
