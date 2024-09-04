import { Lucia, Session, User } from "lucia";

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import prisma from "../../lib/prisma";
import { RoleUser } from "@prisma/client";
import { cookies } from "next/headers";
import { cache } from "react";


const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			role: attributes.role,
			email: attributes.email,
			passport: attributes.passport,
		};
	},
});

export const getUser = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}

		const result = await lucia.validateSession(sessionId);

		try {
			if (result.session && result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(
					result.session.id
				);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			}
		} catch {
			// Next.js throws error when attempting to set cookies when rendering page
		}

		return result;
	}
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: {
			name: string;
			email: string;
			role: RoleUser;
			passport: string | null;
		};
	}
}