import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
    json,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "remix";
import crypto from "crypto";
import { User } from "~/models/user";
import {
    authenticateUserById,
    getSessionData,
} from "~/services/authService.server";
import { databaseService } from "~/services/databaseService.server";
import { storageService } from "~/services/storageService.server";
import { ActionFunctionArg } from "~/utils/remix";
import { getUserProfileUpdateSchema } from "~/utils/validationSchemas";

const ONE_YEAR_IN_SECONDS = 365 * 12 * 24 * 60 * 60;

export class UserController {
    async updateAuthenticatedUser({
        request,
    }: ActionFunctionArg): Promise<Response> {
        const session = getSessionData(request);

        if (!session) {
            throw new Response(null, { status: 403 });
        }

        const formData = await unstable_parseMultipartFormData(
            request,
            unstable_createMemoryUploadHandler({}),
        );

        let updatePayload: Partial<User> = {};

        try {
            updatePayload = await getUserProfileUpdateSchema().validate(
                {
                    firstName:
                        (formData.get("firstName") as null | string) ?? "",
                    lastName: (formData.get("lastName") as null | string) ?? "",
                },
                { abortEarly: false, stripUnknown: true },
            );
        } catch (error) {
            return json({ data: null, error: error });
        }

        const file = formData.get("avatar") as File;

        let user: PostgrestSingleResponse<User>;

        if (file) {
            user = await databaseService()
                .from<User>("users")
                .select("avatar")
                .match({ id: session.id })
                .single();

            if (user.data!.avatar) {
                storageService().from("avatars").remove([user.data!.avatar]);
            }

            let nextFilename = crypto.randomUUID();

            if (file instanceof File) {
                await storageService()
                    .from("avatars")
                    .upload(nextFilename, await file.arrayBuffer(), {
                        contentType: file.type,
                        cacheControl: `max-age=${ONE_YEAR_IN_SECONDS}`,
                    });

                updatePayload.avatar = nextFilename;
            }
        }

        user = await databaseService()
            .from<User>("users")
            .update(updatePayload)
            .match({ id: session.id })
            .single();

        return json(
            { user: user.data },
            {
                headers: {
                    "Set-Cookie": await authenticateUserById(user.data!.id),
                },
            },
        );
    }
}
