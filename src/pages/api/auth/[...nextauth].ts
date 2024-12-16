import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { AuthOptions } from "next-auth";
import authService, { AuthenticatedUser } from "@/common/services/AuthService";
import { Role } from "@prisma/client";


const authOptions: AuthOptions = {
	session: {
		strategy: "jwt"
	},
	jwt: {
		maxAge: 60 * 60
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					type: 'string'
				},
				password: {
					type: 'string'
				}
			},
			authorize: async (credentials) => {
				const user = await authService.matchUser(credentials?.email, credentials?.password);
				return user && user.role !== Role.EMPLOYEE ? user : null;
			}
		}),
	],
	callbacks: {
		jwt({token, user}) {
			if (user) {
				const authenticatedUser = user as AuthenticatedUser
				for (const key of Object.keys(authenticatedUser)) {
					// @ts-ignore
					if (authenticatedUser[key]) {
						// @ts-ignore
						token[key] = authenticatedUser[key]
					}
				}
			}
			return token
		}
	},
	pages: {
		signIn: "/login",
		signOut: '/logout',
	}
}

export default NextAuth(authOptions)