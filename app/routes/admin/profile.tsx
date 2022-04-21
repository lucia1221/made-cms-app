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

export default function ProfileRoute() {
    let FORM_ID = "profile-form";
    let AVATAR_FIELD_NAME = "avatar";

    let avatarInputRef = createRef<AvatarEditor>();

    let handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let avatar = avatarInputRef.current?.getImage();
        let formData = new FormData(
            document.getElementById(FORM_ID) as HTMLFormElement,
        );

        if (avatar) {
            avatar.toBlob(
                (blob) => {
                    if (blob) {
                        formData.set(AVATAR_FIELD_NAME, blob);
                    }

                    fetcher.submit(formData, {
                        encType: "multipart/form-data",
                        method: "patch",
                    });
                },
                "image/jpeg",
                0.9,
            );
        } else {
            fetcher.submit(formData, {
                encType: "multipart/form-data",
                method: "patch",
            });
        }
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
            >
                <AvatarInput name={AVATAR_FIELD_NAME} ref={avatarInputRef} />
                <div className="text-inputs">
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
                </div>
                <Button type="submit" appearance="primary">
                    Save changes
                </Button>

                {fetcher.data?.user ? (
                    <Alert
                        type="success"
                        style={{ marginTop: 20, width: 400, height: 40 }}
                    >
                        Profile update successfully.
                    </Alert>
                ) : null}
            </Form>
        </RequestContext.Provider>
    );
}
