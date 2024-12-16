import {EmployeeCreateDto, EmployeeCreateFilesDto} from "@/domain/employees/dtos/EmployeeCreateDto";
import {Role} from "@prisma/client";
import fileService from "@/common/services/FileService";
import {md5Hash} from "@/common/utils/functions";
import {compare, hash} from "bcrypt";
import prisma from "@/common/libs/prisma";
import {EmployeeUpdateDto, EmployeeUpdateFilesDto} from "@/domain/employees/dtos/EmployeeUpdateDto";
import mailService from "@/common/services/MailService";
import staticValues from "@/common/context/StaticValues";
import {v4} from "uuid";

class EmployeeService {
    getAll = async (customerId: string) =>
        await prisma
            .employee
            .findMany({
                where: {
                    customer: {id: customerId}
                },
                include: {department: true, user: true}
            })

    getDepartments = async (customerId: string) =>
        await prisma
            .department
            .findMany({
                where: {
                    customer: {id: customerId}
                }
            })

    addOne = async (employeeDto: EmployeeCreateDto & EmployeeCreateFilesDto): Promise<keyof typeof staticValues.notification> => {
        const customer = await prisma
            .customer
            .findUnique({
                where: {id: employeeDto.customerId},
                select: {id: true, maxEmployees: true}
            })
        if (!customer) {
            return 'unexpectedError'
        }
        const employeeCount = await prisma
            .employee
            .count({
                where: {customerId: employeeDto.customerId}
            })
        if (employeeCount >= customer.maxEmployees) {
            return 'maxEmployeesExceeded'
        }
        const rawPassword = md5Hash(employeeDto.email)
        const photo = await fileService.save('employees/photos', employeeDto.photo)
        const employee = await prisma
            .employee
            .create({
                data: {
                    firstName: employeeDto.firstName,
                    lastName: employeeDto.lastName,
                    phone: employeeDto.phone,
                    registration: employeeDto.registration,
                    level: employeeDto.level,
                    photo,
                    customer: {
                        connect: {id: employeeDto.customerId}
                    },
                    department: employeeDto.departmentId
                        ? {connect: {id: employeeDto.departmentId}}
                        : {
                            create: {
                                title: employeeDto.departmentName!,
                                customer: {
                                    connect: {id: employeeDto.customerId}
                                }
                            }
                        },
                    user: {
                        create: {
                            email: employeeDto.email,
                            password: await hash(rawPassword, 12),
                            role: Role.EMPLOYEE
                        }
                    }
                },
                include: {
                    user: {
                        select: {
                            email: true
                        }
                    }
                }
            })
        await mailService.send(
            'your-tandeem-account.ejs',
            {
                name: `${employee.firstName} ${employee.lastName}`,
                email: employee.user.email,
                password: rawPassword
            },
            {
                to: employee.user.email,
                subject: 'Votre compte tandeem ! 🙌'
            }
        )
        return 'employeeAddedSuccess'
    }

    updateOne = async (employeeDto: EmployeeUpdateDto & EmployeeUpdateFilesDto): Promise<keyof typeof staticValues.notification> => {
        if (employeeDto.photo) await fileService.replace(employeeDto.imageRef, employeeDto.photo)
        await prisma
            .employee
            .update({
                data: {
                    firstName: employeeDto.firstName,
                    lastName: employeeDto.lastName,
                    phone: employeeDto.phone,
                    registration: employeeDto.registration,
                    level: employeeDto.level,
                    department: employeeDto.departmentId
                        ? {connect: {id: employeeDto.departmentId}}
                        : {
                            create: {
                                title: employeeDto.departmentName!,
                                customer: {connect: {id: employeeDto.customerId}}
                            }
                        },
                },
                where: {
                    id: employeeDto.employeeId,
                    customerId: employeeDto.customerId
                }
            });
        return 'employeeUpdatedSuccess'
    }

    deleteOne = async (id: string): Promise<keyof typeof staticValues.notification> => {
        await prisma.$transaction(async ctx => {
            const {user, photo} = await ctx.employee.delete({
                where: {id},
                select: {user: {select: {id: true}}, photo: true}
            })
            await ctx.user.delete({where: {id: user.id}})
            fileService.delete(photo).then();
        })
        return 'employeeDeletedSuccess'
    };

    async resetPassword(id: string): Promise<keyof typeof staticValues.notification> {
        await prisma
            .$transaction(async (ctx) => {
                const employee = await ctx.employee.findUnique({
                    where: {id},
                    select: {
                        firstName: true,
                        user: {
                            select: {email: true}
                        }
                    }
                })
                if (employee) {
                    const rawPassword = md5Hash(employee.user.email)
                    const password = await hash(rawPassword, 12)
                    await ctx.employee.update({
                        where: {id},
                        data: {
                            user: {update: {password}}
                        }
                    })
                    await mailService.sendAccountDetails(
                        {name: employee.firstName, address: employee.user.email},
                        rawPassword
                    )
                }
            })
        return 'employeePasswordResetSuccess'
    }

    async updatePassword(email: string, oldPassword: string, newPassword: string) {
        return prisma
            .$transaction(async (ctx) => {
                const employee = await ctx.user.findUnique({
                    where: {email},
                    select: {password: true}
                })
                if (employee && (await compare(oldPassword, employee.password))) {
                    await ctx.user.update({
                        where: {email},
                        data: {password: await hash(newPassword, 12)}
                    })
                    return true;
                }
                return false;
            });
    }

    async requestPasswordReset(email: string) {
        const resetToken = v4();
        const resetTokenExpiresAt = new Date()
        resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1);
        const user = await prisma.user.findUnique({
            where: {
                email,
                role: Role.EMPLOYEE
            },
            select: {
                id: true,
                email: true
            }
        })
        if (user) {
            const employee = await prisma.employee.update({
                data: {
                    user: {
                        update: {
                            resetToken,
                            resetTokenExpiresAt
                        }
                    }
                },
                where: {
                    userId: user.id
                }
            })
            await mailService.send(
                'reset-password.ejs',
                {
                    name: `${employee.firstName} ${employee.lastName}`,
                    hostname: process.env.HOSTNAME,
                    expiresAt: `${[resetTokenExpiresAt.getDate().toString().padStart(2, '0'), (resetTokenExpiresAt.getMonth() + 1).toString().padStart(2, '0'), resetTokenExpiresAt.getFullYear()].join('/')} à ${[resetTokenExpiresAt.getHours().toString().padStart(2, '0'), resetTokenExpiresAt.getMinutes().toString().padStart(2, '0')].join(':')}`,
                    token: resetToken
                },
                {
                    to: user.email,
                    subject: 'Votre compte tandeem - Réinitialiser le mot de passe'
                }
            )
            return true
        }
        return false
    }
}

let employeeService: EmployeeService;

if (process.env.NODE_ENV === 'production') employeeService = new EmployeeService();
else {
    if (!global.employeeService) global.employeeService = new EmployeeService();
    employeeService = global.employeeService;
}

export default employeeService;
