import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// The list of valid categories
enum Category {
  NA = "NA",
  Animals = "Animals",
  MoneyAndFinance = "MoneyAndFinance",
  Beauty = "Beauty",
  BabiesAndKids = "BabiesAndKids",
  Wellness = "Wellness",
  CultureAndEntertainment = "CultureAndEntertainment",
  Education = "Education",
  Food = "Food",
  Technology = "Technology",
  HomeAndDecoration = "HomeAndDecoration",
  Mobility = "Mobility",
  FashionAndAccessories = "FashionAndAccessories",
  AmusementParks = "AmusementParks",
  PressAndMagazines = "PressAndMagazines",
  Catering = "Catering",
  Health = "Health",
  DigitalServices = "DigitalServices",
  HomeServices = "HomeServices",
  Sports = "Sports",
  Travel = "Travel",
}

const categoryService = {
  addCategories: async (categories: string[]) => {
    // Check for existing categories in the database to avoid duplicates
    const existingCategories = await prisma.categories.findMany({
      where: {
        name: {
          in: categories,
        },
      },
    });

    const existingCategoryNames = existingCategories.map((cat) => cat.name);
    const newCategories = categories.filter(
      (category) => !existingCategoryNames.includes(category)
    );

    if (newCategories.length > 0) {
      // Add new categories to the database
      await prisma.categories.createMany({
        data: newCategories.map((category) => ({
          name: category,
          partnerId: "",
        })),
        skipDuplicates: true, // Avoid inserting duplicates if any
      });
    }

    return newCategories; // Return the added categories
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { categories } = req.body;

  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ error: "A list of categories is required" });
  }

  // Validate that all provided categories are valid
  const invalidCategories = categories.filter(
    (category) => !Object.values(Category).includes(category)
  );

  if (invalidCategories.length > 0) {
    return res.status(400).json({
      error: "Some categories are invalid",
      invalidCategories,
    });
  }

  try {
    const result = await categoryService.addCategories(categories);
    return res
      .status(201)
      .json({ message: "Categories added successfully", result });
  } catch (error) {
    console.error("Error adding categories:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
