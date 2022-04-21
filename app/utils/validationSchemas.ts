import { object, string } from "yup";

/**
 * Provides validation schema for user registration flow.
 */
export function getUserRegistrationSchema() {
    return object({
        password: string().required().min(6),
        email: string().email().required(),
        firstName: string().required(),
        lastName: string().required(),
    });
}

/**
 * Provides validation schema for user sign in.
 */
export function getUserLoginSchema() {
    return object({
        password: string().required(),
        email: string().email().required(),
    });
}

/**
 *  Provide validation schema generic transactional email entity.
 */
export function getTransactionalEmailSchema() {
    return object({
        email: string().email().required(),
    });
}

export function getUserProfileUpdateSchema() {
    return object({
        firstName: string().required(),
        lastName: string().required(),
    });
}
