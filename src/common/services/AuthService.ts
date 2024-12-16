import { Customer, Employee, Role } from "@prisma/client";
import { User as AuthUser } from 'next-auth'
import { compare, hash } from 'bcrypt'
import prisma from "@/common/libs/prisma";
import staticValues from "@/common/context/StaticValues";
import { v4 } from "uuid";
import mailService from "@/common/services/MailService";

export interface AuthenticatedUser extends AuthUser {
    id: string
    name: string
    email: string
    role: Role
    customer: Customer | null
    employee: Employee | null
}

class AuthService {
    matchUser = async (_email?: string, _password?: string): Promise<AuthenticatedUser | null> => {
        const email = _email?.trim()
        const password = _password?.trim()

        if (!password || !email) return null

        const user = await prisma
            .user
            .findUnique({
                where: {email},
                include: {customer: true, employee: true, admin: true}
            })
        if (!user || !(await compare(password, user.password)) || !user.isActive) return null

        const name = user.admin?.name ?? user.customer?.name ?? `${user.employee?.firstName} ${user.employee?.lastName}`
        const image = user.admin?.photo ?? user.customer?.logo ?? user.employee?.photo
        return {
            id: user.id,
            email: user.email,
            name,
            image,
            role: user.role,
            customer: user.customer,
            employee: user.employee
        }
    };

    async updatePassword(email: string, oldPassword: string, newPassword: string): Promise<keyof typeof staticValues.notification> {
        const user = await prisma.user.findUnique(
            {
                where: {email},
                select: {password: true}
            })
        const passwordsMatch = user && await compare(oldPassword, user.password)
        if (!passwordsMatch) {
            return 'passwordNotMatch'
        }
        await prisma.user.update({
            where: {email},
            data: {password: await hash(newPassword, 12)}
        })
        return 'passwordUpdatedSuccessfully'
    }

    async createResetPasswordRequest(email: string): Promise<keyof typeof staticValues.notification> {
        const resetToken = v4();
        const resetTokenExpiresAt = new Date()
        resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1);
        const user = await prisma.user.update({
            data: {
                resetToken,
                resetTokenExpiresAt
            },
            where: {
                email,
                role: {not: Role.TANDEEM}
            },
            include: {
                admin: true,
                customer: true,
                employee: true,
            }
        })
        await mailService.send(
            'reset-password.ejs',
            {
                name: user.employee
                    ? `${user.employee.firstName} ${user.employee.lastName}`
                    : user.admin
                        ? user.admin.name
                        : `Admin ${user.customer?.name}`,
                hostname: process.env.HOSTNAME,
                expiresAt: `${[resetTokenExpiresAt.getDate().toString().padStart(2, '0'), (resetTokenExpiresAt.getMonth() + 1).toString().padStart(2, '0'), resetTokenExpiresAt.getFullYear()].join('/')} à ${[resetTokenExpiresAt.getHours().toString().padStart(2, '0'), resetTokenExpiresAt.getMinutes().toString().padStart(2, '0')].join(':')}`,
                token: resetToken
            },
            {
                to: user.email,
                subject: 'Votre compte tandeem - Réinitialiser le mot de passe'
            }
        )
        return 'passwordResetSentSuccess'
    }

    async resetPassword(token: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                resetToken: token
            }
        })
        if (user) {
            if (user.resetTokenExpiresAt! > new Date()) {
                await prisma.user.update({
                    where: {id: user.id},
                    data: {
                        resetToken: {set: null},
                        resetTokenExpiresAt: {set: null},
                        password: await hash(password, 12)
                    }
                })
                return 'passwordUpdatedSuccessfully'
            }
            return 'resetTokenExpired'
        }
        return 'passwordResetError'
    }
}

let authService: AuthService;

if (process.env.NODE_ENV === 'production') authService = new AuthService();
else {
    if (!global.authService) global.authService = new AuthService();
    authService = global.authService;
}
export default authService;