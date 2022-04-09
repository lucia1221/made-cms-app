import { Heading, Paragraph } from "evergreen-ui";
import {
    Form,
    LinksFunction,
    useActionData,
    useSearchParams,
    useTransition,
} from "remix";
import { TextInput } from "~/components";
import { Alert } from "~/components/alert";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { RequestContext } from "~/components/context";
import { AuthController } from "~/controllers/admin/AuthController";
import { ActionDataFunction } from "~/utils/remix";
import { Button, links as buttonLinks } from "~/components/button";
import {
    ButtonGroup,
    links as buttonGroupLinks,
} from "~/components/buttonGroup";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./admin.auth.password-reset.css") },
        ...buttonGroupLinks(),
        ...buttonLinks(),
    ];
};

export let action: ActionDataFunction = async function (args) {
    let controller = new AuthController();
    return controller.requestPasswordResetEmail(args);
};

export const CatchBoundary =
    createFormValidationCatchBoundary(ForgotPasswordRoute);

export default function ForgotPasswordRoute() {
    let [searchParams] = useSearchParams();
    let actionData = useActionData();
    let transition = useTransition();

    return (
        <RequestContext.Provider value={{ error: actionData?.error }}>
            <Form method="post" className="reset-form">
                <Heading size={700}>Password reset</Heading>
                <Paragraph>
                    Send a link to your email to reset your password.
                </Paragraph>

                <fieldset
                    disabled={!!actionData?.data || transition.state !== "idle"}
                >
                    <TextInput
                        name="email"
                        type="email"
                        label="Email address"
                        autoComplete="email"
                    />
                    <input
                        name="token"
                        defaultValue={searchParams.get("token") ?? ""}
                        type="hidden"
                    />
                    <ButtonGroup alignChildren="end">
                        <Button appearance="primary">Reset password</Button>
                    </ButtonGroup>
                </fieldset>
                {actionData?.data ? (
                    <Alert type="success" style={{ marginTop: 20 }}>
                        Password reset successfully.
                    </Alert>
                ) : null}
            </Form>
        </RequestContext.Provider>
    );
}
