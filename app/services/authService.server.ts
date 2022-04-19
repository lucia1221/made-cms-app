import { SessionUser, User } from "~/models/user";
import { getUserLoginSchema } from "~/utils/validationSchemas";
import { databaseService } from "./databaseService.server";
import { CookieOptions, createJwtCookie } from "./jwtCookieService.server";

const ONE_WEEK_IN_SECONDS = 604800;

class AuthenticationError extends Error {}

export function isAuthenticationError(
    subject: unknown,
): subject is AuthenticationError {
    return subject instanceof AuthenticationError;
}

const SESSION_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    maxAge: ONE_WEEK_IN_SECONDS,
    path: "/",
    sameSite: "lax",
    secret: process.env.APP_KEY,
    secure: process.env.NODE_ENV === "production",
};

/**
 * Get session data from request.
 *
 * @param request Request
 * @returns Session data or null.
 */
export function getSessionData(request: Request): null | SessionUser {
    return createJwtCookie<SessionUser>(
        "session",
        SESSION_COOKIE_OPTIONS,
    ).parse(request.headers.get("cookie"));
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

    return createJwtCookie("session", SESSION_COOKIE_OPTIONS).serialize({
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
    return createJwtCookie("session", SESSION_COOKIE_OPTIONS).serialize(
        {},
        { expires: new Date(0), maxAge: -1 },
    );
}
