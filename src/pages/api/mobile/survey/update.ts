import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for response
const ResponseSchema = z.object({
  surveyId: z.string().uuid(),
  optionText: z.string(),
});

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Get employee ID from authenticated request
  const employeeId = req?.user?.id;

  if (!employeeId) {
    return res.status(401).json({ error: "Employee ID not found" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const validationResult = ResponseSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.errors,
      });
    }

    const { surveyId, optionText } = validationResult.data;

    // Verify the survey exists and contains the optionText in its paul array
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return res.status(404).json({ error: "Survey not found" });
    }

    // Check if the optionText exists in the paul array
    const paulOption = survey.paul.find((p: any) => p.text === optionText);
    if (!paulOption) {
      return res.status(400).json({ error: "Invalid option selected" });
    }

    // Check if employee has already responded
    const existingResponse = await prisma.survey.findUnique({
      where: {
        id: surveyId,
        employeeId,
      },
    });

    if (!existingResponse) {
      return res
        .status(404)
        .json({ error: "No existing response found to update" });
    }

    // Update the response
    const response = await prisma.survey.update({
      where: {
        id: surveyId,
        employeeId,
      },
      data: {
        title: optionText,
        updatedAt: new Date(),
      },
    });

    // Get all responses to recalculate statistics
    const allResponses = await prisma.survey.findMany({
      where: { id: surveyId },
    });

    // Update paul statistics
    const updatedPaul = survey.paul.map((option: any) => {
      const responseCount = allResponses.filter(
        (r) => r.title === option.text
      ).length;
      const percentage = (responseCount / allResponses.length) * 100;
      return {
        ...option,
        total: allResponses.length,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
      };
    });

    // Update the survey with new statistics
    await prisma.survey.update({
      where: { id: surveyId },
      data: { paul: updatedPaul },
    });

    return res.status(200).json({
      response,
      updatedStatistics: updatedPaul,
    });
  } catch (error) {
    console.error("Survey response update failed:", error);
    return res.status(500).json({
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}

export default authMiddleware(handler);
