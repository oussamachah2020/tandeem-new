-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Card', 'Coupon', 'Ticket', 'PromoCode');

-- CreateEnum
CREATE TYPE "SubPaymentMethod" AS ENUM ('NA', 'PromoCode_OneCode', 'PromoCode_MultipleCodes', 'Coupon_Pregenerated', 'Coupon_Generated');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TANDEEM', 'TANDEEM2', 'CUSTOMER', 'CUSTOMER2', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "JobLevel" AS ENUM ('BoardMember', 'CEO', 'ExecutiveCommittee', 'Manager', 'ProjectLead', 'TeamLead', 'Coordinator', 'Technician', 'Assistant', 'Intern');

-- CreateEnum
CREATE TYPE "ContractStatusName" AS ENUM ('Active', 'SoonToBeEnded', 'Ended', 'SoonToBeTerminated', 'Terminated');

-- CreateEnum
CREATE TYPE "OfferStatusName" AS ENUM ('Active', 'Inactive', 'NoContract');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('NA', 'Animals', 'MoneyAndFinance', 'Beauty', 'BabiesAndKids', 'Wellness', 'CultureAndEntertainment', 'Education', 'Food', 'Technology', 'HomeAndDecoration', 'Mobility', 'FashionAndAccessories', 'AmusementParks', 'PressAndMagazines', 'Catering', 'Health', 'DigitalServices', 'HomeServices', 'Sports', 'Travel');

-- CreateEnum
CREATE TYPE "SubCategory" AS ENUM ('NA', 'Animals_PetCare', 'Animals_PetFood', 'Animals_PetAccessories', 'MoneyAndFinance_Banking', 'MoneyAndFinance_Investments', 'MoneyAndFinance_LoansAndCredits', 'Beauty_Makeup', 'Beauty_SkinCare', 'Beauty_HairCare', 'Beauty_Perfume', 'BabiesAndKids_BabyClothing', 'BabiesAndKids_Toys', 'BabiesAndKids_BabyGear', 'Wellness_YogaAndMeditation', 'Wellness_SpaAndMassages', 'Wellness_Nutrition', 'Wellness_Fitness', 'CultureAndEntertainment_Concerts', 'CultureAndEntertainment_Movies', 'CultureAndEntertainment_ArtExhibitions', 'CultureAndEntertainment_Theater', 'CultureAndEntertainment_Museum', 'Education_OnlineCourses', 'Education_BooksAndManuals', 'Education_SchoolSupplies', 'Education_DaycareAndChildcare', 'Food_Supermarkets', 'Food_Butcher', 'Food_Bakery', 'Food_Delicatessen', 'Technology_PhonesAndTablets', 'Technology_ComputersAndAccessories', 'Technology_ElectronicDevices', 'Technology_SmallAppliances', 'Technology_LargeAppliances', 'Technology_Repair', 'HomeAndDecoration_Furniture', 'HomeAndDecoration_InteriorDecoration', 'HomeAndDecoration_DIY', 'Mobility_CarRental', 'Mobility_ChauffeuredTransport', 'Mobility_Carpooling', 'Mobility_PublicTransport', 'FashionAndAccessories_MensClothing', 'FashionAndAccessories_WomensClothing', 'FashionAndAccessories_FashionAccessories', 'FashionAndAccessories_Shoes', 'AmusementParks_ThemeParks', 'AmusementParks_ZoosAndAquariums', 'AmusementParks_NaturalParks', 'PressAndMagazines_MagazineSubscriptions', 'PressAndMagazines_DailyNewspapers', 'PressAndMagazines_SpecializedJournals', 'Catering_Burger', 'Catering_Pizza', 'Catering_Asian', 'Catering_Oriental', 'Catering_Italian', 'Catering_LatinAmerican', 'Catering_Mediterranean', 'Catering_International', 'Health_Pharmacy', 'Health_Laboratory', 'Health_MedicalConsultations', 'Health_HealthProducts', 'DigitalServices_VODStreaming', 'DigitalServices_MusicStreaming', 'HomeServices_Housekeeping', 'HomeServices_Gardening', 'HomeServices_Repairs', 'Sports_SportingGoods', 'Sports_GymsAndFitness', 'Sports_OtherSportsActivities', 'Sports_Ticketing', 'Travel_Plane', 'Travel_Train', 'Travel_HotelsAndAccommodation', 'Travel_TravelPackages');

-- CreateTable
CREATE TABLE "contract" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "scan" TEXT NOT NULL,
    "from" DATE NOT NULL,
    "to" DATE NOT NULL,
    "prematureTo" DATE,
    "status" "ContractStatusName" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,

    CONSTRAINT "publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'NA',
    "maxEmployees" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "representativeId" UUID NOT NULL,
    "contractId" UUID NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "registration" TEXT,
    "phone" TEXT,
    "photo" TEXT NOT NULL,
    "level" "JobLevel" NOT NULL,
    "acceptedTOS" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" "SubCategory" NOT NULL DEFAULT 'NA',
    "from" DATE NOT NULL,
    "to" DATE NOT NULL,
    "initialPrice" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "subPaymentMethod" "SubPaymentMethod" NOT NULL,
    "paymentDetails" JSONB NOT NULL,
    "status" "OfferStatusName" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,
    "partnerId" UUID,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accepted_offer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "for" "JobLevel"[],
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "offerId" UUID NOT NULL,
    "customerId" UUID NOT NULL,

    CONSTRAINT "accepted_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'NA',
    "accepts" "PaymentMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contractId" UUID NOT NULL,
    "representativeId" UUID NOT NULL,

    CONSTRAINT "partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "representative" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "resetToken" UUID,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_library" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID,

    CONSTRAINT "media_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_offers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employeeId" UUID NOT NULL,
    "offerId" UUID NOT NULL,

    CONSTRAINT "employee_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idea_box" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeId" UUID NOT NULL,

    CONSTRAINT "idea_box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_representativeId_key" ON "customer"("representativeId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_contractId_key" ON "customer"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userId_key" ON "employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accepted_offer_customerId_offerId_key" ON "accepted_offer"("customerId", "offerId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_contractId_key" ON "partner"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_representativeId_key" ON "partner"("representativeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_resetToken_key" ON "user"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "admin_userId_key" ON "admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_offers_employeeId_offerId_key" ON "employee_offers"("employeeId", "offerId");

-- AddForeignKey
ALTER TABLE "publication" ADD CONSTRAINT "publication_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepted_offer" ADD CONSTRAINT "accepted_offer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accepted_offer" ADD CONSTRAINT "accepted_offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner" ADD CONSTRAINT "partner_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner" ADD CONSTRAINT "partner_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "representative"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_offers" ADD CONSTRAINT "employee_offers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_offers" ADD CONSTRAINT "employee_offers_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "idea_box" ADD CONSTRAINT "idea_box_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
