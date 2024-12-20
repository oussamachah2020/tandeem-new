-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "partnerId" UUID NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
