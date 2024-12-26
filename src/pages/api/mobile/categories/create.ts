import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  "NA",
  "Animals",
  "MoneyAndFinance",
  "Beauty",
  "BabiesAndKids",
  "Wellness",
  "CultureAndEntertainment",
  "Education",
  "Food",
  "Technology",
  "HomeAndDecoration",
  "Mobility",
  "FashionAndAccessories",
  "AmusementParks",
  "PressAndMagazines",
  "Catering",
  "Health",
  "DigitalServices",
  "HomeServices",
  "Sports",
  "Travel",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Use Promise.all to wait for all insertions to complete
    await Promise.all(
      CATEGORIES.map((category) =>
        prisma.categories.create({
          data: {
            name: category,
          },
        })
      )
    );

    return res.status(201).json({
      message: "Categories added successfully.",
    });
  } catch (error) {
    console.error("Error inserting categories:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while inserting categories." });
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}
