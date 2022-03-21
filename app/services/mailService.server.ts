import { UserInvitation } from "~/models/userInvitation";
import { ServerClient, TemplatedMessage } from "postmark";
import { ApiInputError } from "postmark/dist/client/errors/Errors";

import { MessageSendingResponse } from "postmark/dist/client/models";

const NO_REPLY_EMAIL = "noreply@blog.bymade.sk";

const DEFAULT_TEMPLATE_DATA = {
  product_name: "Blog by .made",
  product_url: process.env.APP_URL,
};

function serverClient(): ServerClient {
  return new ServerClient(process.env.POSTMARK_TOKEN);
}

interface PostMarkSuccessResponse {
  data: MessageSendingResponse;
  error: null;
}

interface PostMarkErrorResponse {
  data: null;
  error: ApiInputError;
  status: number;
}

type PostMarkResponse = PostMarkSuccessResponse | PostMarkErrorResponse;

export async function sendInvitationEmail(
  invitation: UserInvitation,
): Promise<PostMarkResponse> {
  let actionUrl = new URL("/register", process.env.APP_URL);
  actionUrl.searchParams.set("token", invitation.token);
  actionUrl.searchParams.set("email", invitation.email);

  let templatedMessage = new TemplatedMessage(
    NO_REPLY_EMAIL,
    process.env.POSTMARK_TEMPLATE_USER_INVITATION,
    {
      action_url: actionUrl.toString(),
      ...DEFAULT_TEMPLATE_DATA,
    },
    invitation.email,
  );

  try {
    let response = await serverClient().sendEmailWithTemplate(templatedMessage);
    return { data: response, error: null };
  } catch (error) {
    return {
      data: null,
      error: error as ApiInputError,
      status: (error as ApiInputError).statusCode,
    };
  }
}
