import prisma from "@/common/libs/prisma";
import { PublicationCreateDto } from "@/domain/publications/dtos/PublicationCreateDto";
import { PublicationUpdateDto } from "@/domain/publications/dtos/PublicationUpdateDto";
import staticValues from "@/common/context/StaticValues";

class PublicationService {
  getAll = async (customerId?: string) =>
    prisma.publication.findMany({
      where: customerId
        ? { customerId }
        : {
            customer: {
              is: null,
            },
          },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });

  addOne = async (
    publicationDto: PublicationCreateDto
  ): Promise<keyof typeof staticValues.notification> => {
    await prisma.publication.create({
      data: {
        title: publicationDto.title,
        content: publicationDto.content,
        pinned: publicationDto.pinned !== undefined,
        photos: publicationDto.photos,
        customerId: publicationDto.customerId ?? null,
      },
    });
    return "publicationAddedSuccess";
  };

  updateOne = async (
    publicationDto: PublicationUpdateDto
  ): Promise<keyof typeof staticValues.notification> => {
    // await fileService.replace(publicationDto.imageRef, publicationDto.image);
    await prisma.publication.update({
      data: {
        title: publicationDto.title,
        content: publicationDto.content,
        pinned: publicationDto.pinned !== undefined,
      },
      where: publicationDto.customerId
        ? { id: publicationDto.id, customerId: publicationDto.customerId }
        : { id: publicationDto.id },
    });
    return "publicationUpdatedSuccess";
  };

  deleteOne = async (
    id: string
  ): Promise<keyof typeof staticValues.notification> => {
    await prisma.publication.delete({ where: { id } });
    return "publicationDeletedSuccess";
  };
}

let publicationService: PublicationService;

if (process.env.NODE_ENV === "production")
  publicationService = new PublicationService();
else {
  if (!global.publicationService)
    global.publicationService = new PublicationService();
  publicationService = global.publicationService;
}
export default publicationService;
