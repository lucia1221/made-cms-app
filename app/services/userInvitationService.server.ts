import { UserInvitation } from "~/models/userInvitation";
import { getUserInvitationSchema } from "~/utils/validationSchemas";
import { databaseService } from "./databaseService";
import { sendInvitationEmail } from "./mailService.server";

export async function inviteUser(email: string): Promise<UserInvitation> {
  let schema = getUserInvitationSchema();

  let data = await schema.validate({
    email: email,
  });

  let dbResponse = await databaseService()
    .from<UserInvitation>("user_invitations")
    .insert(data)
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
