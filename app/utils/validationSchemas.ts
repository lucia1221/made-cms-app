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
 * Provides validation schema for password reset.
 */
export function getPasswordResetSchema(){
  return object ({
    email: string().email().required(),
  })
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
 *  Provide validation schema for user invitation.
 */
export function getUserInvitationSchema() {
  return object({
    email: string().email().required(),
  });
}
