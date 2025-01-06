import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for paul array items
const PaulItemSchema = z.object({
  text: z.string(),
  percentage: z.number(),
  total: z.number(),
});

// Validation schema for request body
const SurveySchema = z.object({
  title: z.string(),
  paul: z.array(PaulItemSchema),
  customerId: z.string().uuid().optional(),
  isSurvey: z.boolean().optional().default(true),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = req.user;

  try {
    // Validate request body
    const validationResult = SurveySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.errors,
      });
    }

    const { title, paul, customerId, isSurvey } = validationResult.data;

    // Create new survey
    const survey = await prisma.survey.create({
      data: {
        title,
        paul,
        isSurvey,
        customerId,
        employeeId: user?.id ?? "",
      },
    });

    return res.status(201).json(survey);
  } catch (error) {
    console.error("Survey creation failed:", error);
    return res.status(500).json({
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export default authMiddleware(handler);
