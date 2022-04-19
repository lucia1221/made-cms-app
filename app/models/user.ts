export interface User {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
}

export type SessionUser = Pick<User, "firstName" | "lastName" | "email" | "id">;
