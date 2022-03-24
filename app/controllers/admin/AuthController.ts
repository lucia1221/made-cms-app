
import { json, redirect } from "remix";
import { User } from "~/models/user";
import {
    authenticateUser,
    isAuthenticationError,
    logout,
} from "~/services/authService.server";
import { databaseService } from "~/services/databaseService.server";
import { ActionFunctionArg } from "~/utils/remix";
import { getPasswordResetSchema } from "~/utils/validationSchemas";

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

    public async requestPasswordResetEmail({
        request,
    }: ActionFunctionArg): Promise<Response> {
        let form = await request.formData();
        console.log(form);
        let schema = getPasswordResetSchema();
        let email = form.get("email");
        console.log(email);

        await schema.validate({ email: email }, { abortEarly: false });

        let user = await databaseService()
            .from<User>("users")
            .select()
            .match({ email: email })
            .single();

        if (user.error) {
            throw json(user.error, user);
        }
user.data.email
        console.log(user);

        //   try {
        //     await passwordResetEmail(form.get<string>("email") ?? "", );
        //   } catch (error) {
        //     if (error instanceof ValidationError) {
        //       throw json(error, { status: 422 });
        //     } else {
        //       throw json(error, { status: 400 });
        //     }
        //   }

        return new Response();
    }
}
