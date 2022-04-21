import { createRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { Form, LinksFunction, useFetcher } from "remix";
import { ValidationError } from "yup";
import { Alert, links as alertLinks } from "~/components/alert";
import { Button, links as buttonLinks } from "~/components/button";
import { RequestContext } from "~/components/context";
import {
    AvatarInput,
    links as avatarInputLinks,
} from "~/components/form/AvatarInput";
import {
    links as textInputLinks,
    TextInput,
} from "~/components/form/TextInput";
import { UserController } from "~/controllers/admin/UserController";
import { useSessionData } from "~/hooks/useSessionData";
import { ActionDataFunction } from "~/utils/remix";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./profile.css") },
        ...avatarInputLinks(),
        ...textInputLinks(),
        ...buttonLinks(),
        ...alertLinks(),
    ];
};

export let action: ActionDataFunction = function (args) {
    let controller = new UserController();

    switch (args.request.method.toLocaleLowerCase()) {
        case "patch":
            return controller.updateAuthenticatedUser(args);
    }
};

function getFileBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95);
    });
}

export default function ProfileRoute() {
    let FORM_ID = "profile-form";
    let AVATAR_FIELD_NAME = "avatar";

    let avatarInputRef = createRef<AvatarEditor>();

    let handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let avatar = avatarInputRef.current?.getImage();
        let formData = new FormData(
            document.getElementById(FORM_ID) as HTMLFormElement,
        );

        if (avatar) {
            formData.set(AVATAR_FIELD_NAME, await getFileBlob(avatar));
        } else {
            formData.delete(AVATAR_FIELD_NAME);
        }

        fetcher.submit(formData, {
            encType: "multipart/form-data",
            method: "patch",
        });
    };

    let fetcher = useFetcher();
    let user = useSessionData()!;

    return (
        <RequestContext.Provider
            value={{
                validationError: ValidationError.isError(fetcher?.data?.error)
                    ? fetcher.data.error
                    : null,
            }}
        >
            <Form
                id={FORM_ID}
                method="patch"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                className="route-profile"
            >
                <div>
                    <AvatarInput
                        name={AVATAR_FIELD_NAME}
                        ref={avatarInputRef}
                        src={user.avatar}
                        alt={user.firstName}
                    />
                </div>

                <TextInput
                    name="firstName"
                    type="text"
                    defaultValue={user.firstName}
                    label="First Name"
                />
                <TextInput
                    name="lastName"
                    type="text"
                    defaultValue={user.lastName}
                    label="Last Name"
                />

                <Button
                    type="submit"
                    appearance="primary"
                    disabled={fetcher.state !== "idle"}
                >
                    {fetcher.state !== "idle"
                        ? "Saving changes"
                        : "Save changes"}
                </Button>

                {fetcher.data?.user ? (
                    <Alert type="success" style={{ marginTop: 20 }}>
                        Profile update successfully.
                    </Alert>
                ) : null}
            </Form>
        </RequestContext.Provider>
    );
}
