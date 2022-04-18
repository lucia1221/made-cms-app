import { Form, Link, LinksFunction, useActionData, useTransition } from "remix";
import {
    TextInput,
    links as textInputLinks,
} from "~/components/form/TextInput";
import { Alert, links as alertLinks } from "~/components/alert";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { RequestContext } from "~/components/context";
import { AuthController } from "~/controllers/admin/AuthController";
import { ActionDataFunction } from "~/utils/remix";
import { Button, links as buttonLinks } from "~/components/button";
import {
    ButtonGroup,
    links as buttonGroupLinks,
} from "~/components/buttonGroup";
import * as Text from "~/components/text";
import { AUTH_ROUTES } from "../../admin";
import { ArrowLeft } from "react-feather";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("../auth.css") },
        ...buttonGroupLinks(),
        ...buttonLinks(),
        ...textInputLinks(),
        ...Text.links(),
        ...alertLinks(),
    ];
};

export let action: ActionDataFunction = async function (args) {
    let controller = new AuthController();
    return controller.requestPasswordResetEmail(args);
};

export const CatchBoundary =
    createFormValidationCatchBoundary(ForgotPasswordRoute);

export default function ForgotPasswordRoute() {
    let actionData = useActionData();
    let transition = useTransition();

    return (
        <RequestContext.Provider value={{ error: actionData?.error }}>
            <Form method="post">
                <Text.Heading level="h2">Reset your password</Text.Heading>
                <Text.Paragraph className="subtitle">
                    Enter the email address associated with your account, and
                    we'll send you a link to reset your password.
                </Text.Paragraph>

                {actionData?.data ? (
                    <Alert type="success" style={{ marginTop: 20 }}>
                        Check your email for password reset instructions.
                    </Alert>
                ) : (
                    <fieldset
                        disabled={
                            !!actionData?.data || transition.state !== "idle"
                        }
                    >
                        <TextInput
                            name="email"
                            type="email"
                            autoComplete="username"
                            label="Email address"
                        />

                        <Button
                            block
                            appearance="primary"
                            style={{ marginBottom: 20 }}
                        >
                            Continue
                        </Button>
                        <ButtonGroup alignChildren="center">
                            <Link to={AUTH_ROUTES.login}>
                                <ArrowLeft size={16} />
                                Return to sign in
                            </Link>
                        </ButtonGroup>
                    </fieldset>
                )}
            </Form>
        </RequestContext.Provider>
    );
}
