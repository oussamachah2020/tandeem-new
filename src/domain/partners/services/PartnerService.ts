import {PartnerCreateDto, PartnerCreateFilesDto} from "@/domain/partners/dtos/PartnerCreateDto";
import fileService from "@/common/services/FileService";
import prisma from "@/common/libs/prisma";
import {PartnerUpdateDto, PartnerUpdateFilesDto} from "@/domain/partners/dtos/PartnerUpdateDto";
import staticValues from "@/common/context/StaticValues";

class PartnerService {
    getAllIncludeOffers = async () =>
        await prisma
            .partner
            .findMany({
                include: {
                    representative: true,
                    contract: true,
                    offers: true
                }
            })

    getAll = async () =>
        await prisma
            .partner
            .findMany({
                include: {
                    contract: true,
                    representative: true
                }
            })

    addOne = async (partnerDto: PartnerCreateDto & PartnerCreateFilesDto): Promise<keyof typeof staticValues.notification> => {
        const logo = await fileService.save('logo', partnerDto.logo);
        const scan = await fileService.save('scan', partnerDto.contractScan);

        await prisma
            .partner
            .create({
                data: {
                    name: partnerDto.name,
                    address: partnerDto.address,
                    category: partnerDto.category,
                    website: partnerDto.website,
                    logo,
                    accepts: partnerDto.accepts,
                    representative: {
                        create: {
                            fullName: partnerDto.representativeName,
                            email: partnerDto.representativeEmail,
                            phone: partnerDto.representativePhone
                        }
                    },
                    contract: {
                        create: {
                            from: new Date(partnerDto.contractFrom),
                            to: new Date(partnerDto.contractTo),
                            scan
                        }
                    },
                }
            })
        return 'partnerAddedSuccess'
    }

    async updateOne(editPartnerDto: PartnerUpdateDto & PartnerUpdateFilesDto) {
        if (editPartnerDto.logo) await fileService.replace(editPartnerDto.logoRef, editPartnerDto.logo)
        await prisma
            .partner
            .update({
                data: {
                    name: editPartnerDto.name,
                    address: editPartnerDto.address,
                    website: editPartnerDto.website,
                    category: editPartnerDto.category,
                    accepts: editPartnerDto.accepts,
                    representative: {
                        update: {
                            fullName: editPartnerDto.representativeName,
                            email: editPartnerDto.representativeEmail,
                            phone: editPartnerDto.representativePhone
                        }
                    }
                },
                where: {
                    id: editPartnerDto.id
                }
            })
        return 'partnerUpdatedSuccess'
    }

    async deleteOne(id: string): Promise<keyof typeof staticValues.notification> {
        const partner =
            await prisma
                .partner
                .findUnique({where: {id}, include: {contract: true}})
        if (!partner) return 'partnerNotFound'
        await fileService.delete(partner.logo)
        await fileService.delete(partner.contract.scan)
        await prisma.$transaction([
            prisma.partner.delete({where: {id}}),
            prisma.representative.delete({where: {id: partner.representativeId}}),
            prisma.contract.delete({where: {id: partner.contractId}})
        ])
        return 'partnerDeletedSuccess'
    }
}

let partnerService: PartnerService;

if (process.env.NODE_ENV === 'production') partnerService = new PartnerService();
else {
    if (!global.partnerService) global.partnerService = new PartnerService();
    partnerService = global.partnerService;
}
export default partnerService;