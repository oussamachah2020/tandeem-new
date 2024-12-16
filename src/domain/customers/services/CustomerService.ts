import {CustomerCreateDto, CustomerCreateFilesDto} from "@/domain/customers/dtos/CustomerCreateDto";
import {hash} from 'bcrypt'
import fileService from "@/common/services/FileService";
import {md5Hash} from "@/common/utils/functions";
import mailService from "@/common/services/MailService";
import prisma from "@/common/libs/prisma";
import {CustomerUpdateDto, CustomerUpdateFilesDto} from "@/domain/customers/dtos/CustomerUpdateDto";
import {Role} from "@prisma/client";
import staticValues from "@/common/context/StaticValues";

class CustomerService {
    getAll = async () =>
        await prisma
            .customer
            .findMany({
                include: {
                    representative: true,
                    contract: true,
                    users: {
                        select: {email: true},
                        where: {role: Role.CUSTOMER},
                    }
                }
            });

    getOne = async (id: string) =>
        await prisma
            .customer
            .findUnique({
                include: {
                    representative: true,
                    contract: true,
                    users: {
                        select: {email: true},
                        where: {role: Role.CUSTOMER}
                    },
                    offers: true
                },
                where: {id}
            })

    addOne = async (customerDto: CustomerCreateDto & CustomerCreateFilesDto) : Promise<keyof typeof staticValues.notification> => {
        const rawPassword = md5Hash(customerDto.email)
        const password = await hash(rawPassword, 12)
        const logo = await fileService.save('logo', customerDto.logo);
        const contractScan = await fileService.save('contract', customerDto.contractScan);
        await prisma
            .customer
            .create({
                data: {
                    name: customerDto.name,
                    address: customerDto.address,
                    category: customerDto.category,
                    website: customerDto.website,
                    logo,
                    maxEmployees: Number(customerDto.maxEmployees),
                    representative: {
                        create: {
                            fullName: customerDto.representativeName,
                            email: customerDto.representativeEmail,
                            phone: customerDto.representativePhone
                        }
                    },
                    contract: {
                        create: {
                            from: new Date(customerDto.contractFrom),
                            to: new Date(customerDto.contractTo),
                            scan: contractScan,
                        }
                    },
                    users: {
                        create: {
                            email: customerDto.email,
                            password,
                            role: Role.CUSTOMER
                        }
                    }
                }
            })
        await mailService.sendAccountDetails({name: customerDto.name, address: customerDto.email}, rawPassword)
        return 'customerAddedSuccess'
    }

    async updateOne(editCustomerDto: CustomerUpdateDto & CustomerUpdateFilesDto): Promise<keyof typeof staticValues.notification> {
        if (editCustomerDto.logo) await fileService.replace(editCustomerDto.logoRef, editCustomerDto.logo)
        await prisma.customer.update({
            data: {
                name: editCustomerDto.name,
                address: editCustomerDto.address,
                website: editCustomerDto.website,
                category: editCustomerDto.category,
                maxEmployees: Number(editCustomerDto.maxEmployees),
                representative: {
                    update: {
                        fullName: editCustomerDto.representativeName,
                        email: editCustomerDto.representativeEmail,
                        phone: editCustomerDto.representativePhone
                    }
                }
            },
            where: {
                id: editCustomerDto.id
            }
        })
        return 'customerUpdatedSuccess'
    }

    async deleteOne(id: string): Promise<keyof typeof staticValues.notification> {
        const customer =
            await prisma
                .customer
                .findUnique({
                    where: {id},
                    include: {
                        contract: {select: {id: true, scan: true}},
                        employees: {select: {userId: true}},
                        users: {select: {id: true}}
                    }
                })
        if (!customer) return 'customerNotFound'
        await fileService.delete(customer.logo)
        await fileService.delete(customer.contract.scan)
        await prisma.$transaction([
            prisma.customer.delete({where: {id}}),
            prisma.representative.delete({where: {id: customer.representativeId}}),
            prisma.contract.delete({where: {id: customer.contractId}}),
            prisma.user.deleteMany({where: {customerId: {in: [...customer.users.map(user => user.id), ...customer.employees.map(employee => employee.userId)]}}})
        ])
        return 'customerDeletedSuccess'
    }
}

let customerService: CustomerService;

if (process.env.NODE_ENV === 'production') customerService = new CustomerService();
else {
    if (!global.customerService) global.customerService = new CustomerService();
    customerService = global.customerService;
}
export default customerService;
