import jwt, { SignOptions } from "jsonwebtoken";

export interface CookieOptions {
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    secret: string;
    secure: boolean;
}

class JwtCookie<T = any> {
    constructor(
        public readonly name: string,
        private cookieOptions: CookieOptions,
        private signOptions: Partial<SignOptions> = {},
    ) {}

    serialize(
        value: string | Buffer | object,
        cookieOptions: Partial<CookieOptions> = {},
    ): string {
        const token = jwt.sign(
            value,
            this.cookieOptions.secret,
            this.signOptions,
        );
        const options = { ...this.cookieOptions, ...cookieOptions };

        return [
            `${this.name}=${token}`,
            options.path ? `Path=${options.path}` : null,
            options.maxAge ? `Max-Age=${options.maxAge}` : null,
            options.expires ? `Expires=${options.expires}` : null,
            options.httpOnly ? "HttpOnly" : null,
            options.secure ? "Secure" : null,
        ]
            .filter((segment) => segment !== null)
            .join("; ");
    }

    parse(cookieHeaderValue: string | null): null | T {
        const match =
            (cookieHeaderValue ?? "")
                .split(";")
                .map((val) => val.trim().split("="))
                .find(([key]) => key === this.name) ?? [];

        const [_, token] = match;

        if (!token) {
            return null;
        }

        return jwt.verify(token, this.cookieOptions.secret) as unknown as T;
    }
}

export function createJwtCookie<T>(
    name: string,
    cookieOptions: CookieOptions,
    signOptions: Partial<SignOptions> = {},
): JwtCookie<T> {
    return new JwtCookie(name, cookieOptions, signOptions);
}
