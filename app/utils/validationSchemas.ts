import { object, ref, string } from "yup";

/**
 * Provides validation schema for user registration flow.
 */
export function getUserRegistrationSchema() {
  return object({
    password: string().required().min(6),
    confirmPassword: string().oneOf([ref("password")]),
    email: string().email().required(),
  });
}

/**
 * Provides validation schema for user sign in.
 */
export function getUserLoginSchema() {
  return object({
    password: string().required().min(6),
    email: string().email().required(),
  });
}

/**
 * Provides validation schema for user password reset.
 */
export function getUserResetSchema() {
  return object({
    email: string().email().required(),
  });
}

/**
 *  Provide validation schema for user invitation.
 */
export function getUserInvitationSchema() {
  return object({
    email: string().email().required(),
  });
}
