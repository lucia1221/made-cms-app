import { User } from "~/models/user";
import { getUserLoginSchema } from "~/utils/validationSchemas";
import { databaseService } from "./databaseService.server";
import { createJwtCookie } from "./jwtCookieService.server";

const ONE_WEEK_IN_SECONDS = 604800;

class AuthenticationError extends Error {}

export function isAuthenticationError(
    subject: unknown,
): subject is AuthenticationError {
    return subject instanceof AuthenticationError;
}

const sessionCookie = createJwtCookie<Omit<User, "password">>("session", {
    httpOnly: true,
    maxAge: ONE_WEEK_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secret: process.env.APP_KEY,
    secure: process.env.NODE_ENV === "production",
});

/**
 * Check if request is authenticated.
 *
 * @param request Current request.
 * @returns Decoded session cookie subject, e.g. user.
 */
export function isRequestAuthenticated(request: Request): boolean {
    return null !== sessionCookie.parse(request.headers.get("cookie"));
}

/**
 * Attempt user authentication.
 *
 * @param email
 * @param password
 * @returns Session cookie if credentials match.
 */
export async function authenticateUser(
    email: string,
    password: string,
): Promise<string> {
    await getUserLoginSchema().validate(
        { email: email, password: password },
        { abortEarly: false },
    );

    let userIdentifier = await databaseService()
        .rpc<{ id: number }>("get_user_id_for_credentials", { email, password })
        .select()
        .single();

    if (userIdentifier.error) {
        throw new AuthenticationError("Invalid user name and/or password");
    }

    let user = await databaseService()
        .from<User>("users")
        .select()
        .match({ id: userIdentifier.data.id })
        .single();

    if (user.error) {
        throw user.error;
    }

    return sessionCookie.serialize({
        id: user.data.id,
        firstName: user.data.firstName,
        lastName: user.data.lastName,
        email: user.data.email,
    });
}

/**
 * Destroy session.
 *
 * @returns Expired session cookie.
 */
export function logout(): string {
    return sessionCookie.serialize({}, { expires: new Date(0), maxAge: -1 });
}
