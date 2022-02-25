import { User } from "@supabase/supabase-js";
import { UserInvitation } from "~/models/userInvitation";
import {
  getUserInvitationSchema,
  getUserRegistrationSchema,
} from "~/utils/validationSchemas";
import { databaseService } from "./databaseService";
import { sendInvitationEmail } from "./mailService.server";

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

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export async function registerUser(
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
  return user.data!;
}
