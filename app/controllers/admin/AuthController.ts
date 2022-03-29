import { json, redirect } from "remix";
import { RequestResponse } from "~/models/RequestResponse";
import { TransactionalEmail } from "~/models/transactionalEmail";
import { AUTH_ROUTES } from "~/routes/admin";
import {
    authenticateUser,
    isAuthenticationError,
    logout,
} from "~/services/authService.server";
import {
    createTransactionalEmail,
    sendTransactionalEmail,
} from "~/services/transactionalEmailService.server";
import { ActionFunctionArg } from "~/utils/remix";
import { getTransactionalEmailSchema } from "~/utils/validationSchemas";

export class AuthController {
    public async authenticateUserWithCredentials({
        request,
    }: ActionFunctionArg): Promise<Response> {
        let sessionCookie: string;
        const form = await request.formData();

        try {
            sessionCookie = await authenticateUser(
                form.get<string>("email") ?? "",
                form.get<string>("password") ?? "",
            );
        } catch (error) {
            if (isAuthenticationError(error)) {
                throw new Response(null, { status: 401 });
            }

            throw new Response(JSON.stringify(error), { status: 400 });
        }

        const redirectUrl =
            new URL(request.url).searchParams.get("redirectUrl") ?? "/admin";

        return redirect(redirectUrl, {
            headers: { "set-cookie": sessionCookie },
        });
    }

    public logoutUser(redirectUrl: string): Response {
        return redirect(redirectUrl, {
            headers: {
                "set-cookie": logout(),
            },
        });
    }

    public async inviteUser({
        request,
    }: ActionFunctionArg): Promise<RequestResponse<TransactionalEmail>> {
        // Read data
        let form = await request.formData();
        let email = form.get<string>("email") ?? "";

        // Validate data
        let schema = getTransactionalEmailSchema();

        try {
            await schema.validate({ email });
        } catch (error) {
            return { data: null, error: error };
        }

        // Create transactional email entity
        let emailEntity = await createTransactionalEmail(
            email,
            process.env.POSTMARK_TEMPLATE_USER_INVITATION,
        );

        if (emailEntity.error) {
            throw json(emailEntity.error);
        }

        // Prepare template data and send email
        let actionUrl = new URL(AUTH_ROUTES.register, process.env.APP_URL);
        actionUrl.searchParams.set("token", emailEntity.data.token);
        actionUrl.searchParams.set("email", emailEntity.data.email);

        let emailData = {
            action_url: actionUrl.toString(),
        };

        let emailResponse = await sendTransactionalEmail(
            emailEntity.data,
            emailData,
        );

        if (emailResponse.error) {
            throw json(emailResponse.error);
        }

        return { data: emailEntity.data, error: null };
    }

    public async requestPasswordResetEmail({
        request,
    }: ActionFunctionArg): Promise<RequestResponse<TransactionalEmail>> {
        let form = await request.formData();
        let email = form.get<string>("email") ?? "";

        let schema = getTransactionalEmailSchema();

        try {
            await schema.validate({ email });
        } catch (error) {
            return { data: null, error: error };
        }

        let emailEntity = await createTransactionalEmail(
            email,
            process.env.POSTMARK_TEMPLATE_PASSWORD_RESET,
        );

        if (emailEntity.error) {
            throw json(emailEntity.error);
        }

        let actionUrl = new URL(AUTH_ROUTES.passwordReset, process.env.APP_URL);
        actionUrl.searchParams.set("token", emailEntity.data.token);
        actionUrl.searchParams.set("email", emailEntity.data.email);

        let emailData = {
            action_url: actionUrl.toString(),
        };

        let emailResponse = await sendTransactionalEmail(
            emailEntity.data,
            emailData,
        );

        if (emailResponse.error) {
            throw json(emailResponse.error);
        }

        return { data: emailEntity.data, error: null };
    }
}
