import { User } from "~/models/user";
import { UserInvitation } from "~/models/userInvitation";
import {
  getUserInvitationSchema,
  getUserRegistrationSchema,
} from "~/utils/validationSchemas";
import { databaseService } from "./databaseService.server";
import { sendInvitationEmail, setPasswordResetEmail } from "./mailService.server";

/**
 * Invite user via email invitation.
 *
 * @param email email address
 * @returns UserInvitation object
 */
export async function inviteUser(email: string): Promise<UserInvitation> {
  let schema = getUserInvitationSchema();

  let validatedData = await schema.validate({
    email: email,
  });

  let dbResponse = await databaseService()
    .from<UserInvitation>("user_invitations")
    .insert(validatedData)
    .single();

  if (dbResponse.error) {
    throw dbResponse;
  }

  let mailResponse = await sendInvitationEmail(dbResponse.data);

  if (mailResponse.error) {
    throw mailResponse;
  }

  return dbResponse.data;

}

/**
 * Reset user password via email invitation.
 *
 * @param email email address
 * @returns UserInvitation object
 */
export async function resetPassword(email: string): Promise<UserInvitation> {
  let schema = getUserInvitationSchema();

  let validatedData = await schema.validate({
    email: email,
  });

  let dbResponse = await databaseService()
    .from<UserInvitation>("user_invitations")
    .insert(validatedData)
    .single();

  if (dbResponse.error) {
    throw dbResponse;
  }

  let mailResponse = await setPasswordResetEmail(dbResponse.data);

  if (mailResponse.error) {
    throw mailResponse;
  }

  return dbResponse.data;

}



export interface UserResetPasswordData{
  email: string
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

/**
 * Create new user account.
 *
 * @param token invitation token
 * @param data user data
 * @returns User object
 */
export async function createUser(
  token: string,
  data: UserRegistrationData,
): Promise<User> {
  let schema = getUserRegistrationSchema();

  let validatedData = await schema.validate(data, { abortEarly: false });

  let invitation = await databaseService()
    .from<UserInvitation>("user_invitations")
    .update({ claimed: true })
    .match({ token: token, claimed: false })
    .single();

  if (invitation.error) {
    throw invitation;
  }

  let user = await databaseService()
    .from<User>("users")
    .insert(validatedData)
    .single();

  if (user.error) {
    throw user;
  }

  return user.data;
}
