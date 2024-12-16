import prisma from "@/common/libs/prisma";
import {AdminCreateDto, AdminCreateFilesDto} from "@/domain/admins/dtos/AdminCreateDto";
import fileService from "@/common/services/FileService";
import {md5Hash} from "@/common/utils/functions";
import {Role} from "@prisma/client";
import mailService from "@/common/services/MailService";
import {AdminUpdateDto, AdminUpdateFilesDto} from "@/domain/admins/dtos/AdminUpdateDto";
import {hash} from "bcrypt";
import staticValues from "@/common/context/StaticValues";

class AdminService {
    getAll = async (customerId?: string) =>
        await prisma
            .admin
            .findMany({
                where: {
                    user: customerId
                        ? {
                            customer: {id: customerId}
                        }
                        : {
                            AND: {customer: null, employee: null}
                        }
                },
                include: {user: true}
            })

    async addOne(adminDto: AdminCreateDto & AdminCreateFilesDto) : Promise<keyof typeof staticValues.notification> {
        const photoRef = await fileService.save('admins', adminDto.photo)
        const rawPassword = md5Hash(adminDto.email)
        const password = await hash(rawPassword, 12)
        await prisma
            .admin
            .create({
                data: {
                    name: adminDto.name,
                    photo: photoRef,
                    user: {
                        create: {
                            email: adminDto.email,
                            password,
                            customer: adminDto.customerId ? {connect: {id: adminDto.customerId}} : undefined,
                            role: adminDto.customerId ? Role.CUSTOMER2 : Role.TANDEEM2
                        }
                    }
                }
            })
        mailService.sendAccountDetails({name: adminDto.name, address: adminDto.email}, rawPassword).then()
        return 'adminAddedSuccess'
    }

    async updateOne(adminDto: AdminUpdateDto & AdminUpdateFilesDto): Promise<keyof typeof staticValues.notification> {
        if (adminDto.photo) await fileService.replace(adminDto.photoRef, adminDto.photo)
        await prisma
            .admin
            .update({
                where: {id: adminDto.adminId},
                data: {
                    name: adminDto.name
                }
            })
        return 'adminUpdatedSuccess'
    }

    async deleteOne({id, refs}: { id: string; refs?: string[] }) : Promise<keyof typeof staticValues.notification> {
        if (refs) refs.forEach(ref => fileService.delete(ref))
        await prisma.$transaction(async (ctx) => {
            const admin = await ctx
                .admin
                .findUnique({where: {id}, select: {userId: true}})
            if (admin)
                await ctx
                    .user
                    .delete({
                        where: {id: admin.userId}
                    })
        })
        return 'adminDeletedSuccess'
    }

    async toggleActive(id: string, isActive: boolean): Promise<keyof typeof staticValues.notification> {
        await prisma
            .admin
            .update({
                where: {id},
                data: {
                    user: {
                        update: {isActive}
                    }
                }
            })
        return isActive ? 'adminEnabledSuccess' : 'adminDisabledSuccess'
    }

    async resetPassword(id: string) : Promise<keyof typeof staticValues.notification>{
        await prisma
            .$transaction(async (ctx) => {
                const admin = await ctx.admin.findUnique({
                    where: {id},
                    select: {
                        name: true,
                        user: {
                            select: {email: true}
                        }
                    }
                })
                if (admin) {
                    const rawPassword = md5Hash(admin.user.email)
                    const password = await hash(rawPassword, 12)
                    await ctx.admin.update({
                        where: {id},
                        data: {
                            user: {update: {password}}
                        }
                    })
                    mailService.sendAccountDetails(
                        {name: admin.name, address: admin.user.email},
                        rawPassword
                    ).then()
                }
            })
        return 'adminPasswordResetSuccess'
    }
}

let adminService: AdminService;

if (process.env.NODE_ENV === 'production') adminService = new AdminService();
else {
    if (!global.adminService) global.adminService = new AdminService();
    adminService = global.adminService;
}
export default adminService;