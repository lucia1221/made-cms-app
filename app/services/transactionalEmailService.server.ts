import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { ServerClient, TemplatedMessage } from "postmark";
import { ApiInputError } from "postmark/dist/client/errors/Errors";
import { MessageSendingResponse } from "postmark/dist/client/models";
import { TransactionalEmail } from "~/models/transactionalEmail";
import { databaseService } from "./databaseService.server";

const NO_REPLY_EMAIL = "noreply@blog.bymade.sk";

const DEFAULT_TEMPLATE_DATA = {
    product_name: "Blog by .made",
    product_url: process.env.APP_URL,
};

function emailClient(): ServerClient {
    return new ServerClient(process.env.POSTMARK_TOKEN);
}

export interface PostMarkSuccessResponse {
    data: MessageSendingResponse;
    error: null;
}

export interface PostMarkErrorResponse {
    data: null;
    error: ApiInputError;
}

export type PostMarkResponse = PostMarkSuccessResponse | PostMarkErrorResponse;

/**
 * Create new transactional email record.
 *
 * @param recipient Recipients email address
 * @param template Template name
 */
export function createTransactionalEmail(
    recipient: string,
    template: string,
): PromiseLike<PostgrestSingleResponse<TransactionalEmail>> {
    return databaseService()
        .from<TransactionalEmail>("transactional_emails")
        .insert({
            email: recipient,
            template: template,
        })
        .single();
}

/**
 * Find transaction by token.
 *
 * @param token Transaction token.
 */
export function findTransactionalEmail(
    token: string,
): PromiseLike<PostgrestSingleResponse<TransactionalEmail>> {
    return databaseService()
        .from<TransactionalEmail>("transactional_emails")
        .select()
        .match({ token: token })
        .is("claimedAt", null)
        .single();
}

/**
 * Mark entity as claimed.
 * @param entity
 * @returns
 */
export function claimTransactionalEmail(
    entity: TransactionalEmail,
): PromiseLike<PostgrestSingleResponse<TransactionalEmail>> {
    return databaseService()
        .from<TransactionalEmail>("transactional_emails")
        .update({ claimedAt: new Date() })
        .match({ id: entity.id })
        .single();
}

/**
 * Send transactional email.
 *
 * @param transaction Transaction entity
 * @param data Template data
 * @param from Email address of sender, defaults to "no-reply" address
 * @param defaultData Default template data
 * @returns Promise
 */
export async function sendTransactionalEmail(
    transaction: TransactionalEmail,
    data: Record<string, string>,
    from = NO_REPLY_EMAIL,
    defaultData = DEFAULT_TEMPLATE_DATA,
): Promise<PostMarkResponse> {
    let templatedMessage = new TemplatedMessage(
        from,
        transaction.template,
        { ...defaultData, ...data },
        transaction.email,
    );

    let response: MessageSendingResponse;

    try {
        response = await emailClient().sendEmailWithTemplate(templatedMessage);
    } catch (error) {
        return {
            data: null,
            error: error as ApiInputError,
        };
    }

    return { data: response, error: null };
}
