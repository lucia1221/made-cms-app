import { redirect } from "remix";
import {
    authenticateUser,
    isAuthenticationError,
    logout,
} from "~/services/authService.server";
import { ActionFunctionArg } from "~/utils/remix";

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
}
