import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, SubCategory } from "@prisma/client";

const prisma = new PrismaClient();

// Map each subcategory to its parent category
const SUBCATEGORY_MAPPING: Record<string, SubCategory[]> = {
  NA: [SubCategory.NA],
  Animals: [
    SubCategory.Animals_PetCare,
    SubCategory.Animals_PetFood,
    SubCategory.Animals_PetAccessories,
  ],
  MoneyAndFinance: [
    SubCategory.MoneyAndFinance_Banking,
    SubCategory.MoneyAndFinance_Investments,
    SubCategory.MoneyAndFinance_LoansAndCredits,
  ],
  Beauty: [
    SubCategory.Beauty_Makeup,
    SubCategory.Beauty_SkinCare,
    SubCategory.Beauty_HairCare,
    SubCategory.Beauty_Perfume,
  ],
  BabiesAndKids: [
    SubCategory.BabiesAndKids_BabyClothing,
    SubCategory.BabiesAndKids_Toys,
    SubCategory.BabiesAndKids_BabyGear,
  ],
  Wellness: [
    SubCategory.Wellness_YogaAndMeditation,
    SubCategory.Wellness_SpaAndMassages,
    SubCategory.Wellness_Nutrition,
    SubCategory.Wellness_Fitness,
  ],
  CultureAndEntertainment: [
    SubCategory.CultureAndEntertainment_Concerts,
    SubCategory.CultureAndEntertainment_Movies,
    SubCategory.CultureAndEntertainment_ArtExhibitions,
    SubCategory.CultureAndEntertainment_Theater,
    SubCategory.CultureAndEntertainment_Museum,
  ],
  Education: [
    SubCategory.Education_OnlineCourses,
    SubCategory.Education_BooksAndManuals,
    SubCategory.Education_SchoolSupplies,
    SubCategory.Education_DaycareAndChildcare,
  ],
  Food: [
    SubCategory.Food_Supermarkets,
    SubCategory.Food_Butcher,
    SubCategory.Food_Bakery,
    SubCategory.Food_Delicatessen,
  ],
  Technology: [
    SubCategory.Technology_PhonesAndTablets,
    SubCategory.Technology_ComputersAndAccessories,
    SubCategory.Technology_ElectronicDevices,
    SubCategory.Technology_SmallAppliances,
    SubCategory.Technology_LargeAppliances,
    SubCategory.Technology_Repair,
  ],
  HomeAndDecoration: [
    SubCategory.HomeAndDecoration_Furniture,
    SubCategory.HomeAndDecoration_InteriorDecoration,
    SubCategory.HomeAndDecoration_DIY,
  ],
  Mobility: [
    SubCategory.Mobility_CarRental,
    SubCategory.Mobility_ChauffeuredTransport,
    SubCategory.Mobility_Carpooling,
    SubCategory.Mobility_PublicTransport,
  ],
  FashionAndAccessories: [
    SubCategory.FashionAndAccessories_MensClothing,
    SubCategory.FashionAndAccessories_WomensClothing,
    SubCategory.FashionAndAccessories_FashionAccessories,
    SubCategory.FashionAndAccessories_Shoes,
  ],
  AmusementParks: [
    SubCategory.AmusementParks_ThemeParks,
    SubCategory.AmusementParks_ZoosAndAquariums,
    SubCategory.AmusementParks_NaturalParks,
  ],
  PressAndMagazines: [
    SubCategory.PressAndMagazines_MagazineSubscriptions,
    SubCategory.PressAndMagazines_DailyNewspapers,
    SubCategory.PressAndMagazines_SpecializedJournals,
  ],
  Catering: [
    SubCategory.Catering_Burger,
    SubCategory.Catering_Pizza,
    SubCategory.Catering_Asian,
    SubCategory.Catering_Oriental,
    SubCategory.Catering_Italian,
    SubCategory.Catering_LatinAmerican,
    SubCategory.Catering_Mediterranean,
    SubCategory.Catering_International,
  ],
  Health: [
    SubCategory.Health_Pharmacy,
    SubCategory.Health_Laboratory,
    SubCategory.Health_MedicalConsultations,
    SubCategory.Health_HealthProducts,
  ],
  DigitalServices: [
    SubCategory.DigitalServices_VODStreaming,
    SubCategory.DigitalServices_MusicStreaming,
  ],
  HomeServices: [
    SubCategory.HomeServices_Housekeeping,
    SubCategory.HomeServices_Gardening,
    SubCategory.HomeServices_Repairs,
  ],
  Sports: [
    SubCategory.Sports_SportingGoods,
    SubCategory.Sports_GymsAndFitness,
    SubCategory.Sports_OtherSportsActivities,
    SubCategory.Sports_Ticketing,
  ],
  Travel: [
    SubCategory.Travel_Plane,
    SubCategory.Travel_Train,
    SubCategory.Travel_HotelsAndAccommodation,
    SubCategory.Travel_TravelPackages,
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Get all categories from the database
    const categories = await prisma.categories.findMany();

    // Create subcategories for each category
    await Promise.all(
      categories.map(async (category) => {
        const subcategories = SUBCATEGORY_MAPPING[category.name];
        if (!subcategories) {
          console.warn(`No subcategories found for category: ${category.name}`);
          return;
        }

        // Create all subcategories for this category
        await Promise.all(
          subcategories.map((subcategory) =>
            prisma.subCategories.create({
              data: {
                name: subcategory,
                categoryId: category.id,
              },
            })
          )
        );
      })
    );

    return res.status(201).json({
      message: "Subcategories added successfully.",
    });
  } catch (error) {
    console.error("Error inserting subcategories:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while inserting subcategories." });
  } finally {
    await prisma.$disconnect();
  }
}
