import { Form, Link, LinksFunction } from "remix";
import {
    TextInput,
    links as textInputLinks,
} from "~/components/form/TextInput";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import * as Text from "~/components/text";
import { AuthController } from "~/controllers/admin/AuthController";
import { ActionDataFunction } from "~/utils/remix";
import { AUTH_ROUTES } from "../../admin";
import { Button, links as buttonLinks } from "~/components/button";
import {
    ButtonGroup,
    links as buttonGroupLinks,
} from "~/components/buttonGroup";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("../auth.css") },
        ...buttonGroupLinks(),
        ...buttonLinks(),
        ...textInputLinks(),
        ...Text.links(),
    ];
};

export const action: ActionDataFunction = async function (args) {
    const controller = new AuthController();

    switch (args.request.method) {
        case "POST":
            return controller.authenticateUserWithCredentials(args);

        default:
            return new Response(null, { status: 405 });
    }
};

export const CatchBoundary = createFormValidationCatchBoundary(LoginRoute);

export default function LoginRoute() {
    return (
        <Form method="post" className="login-form">
            <Text.Heading level="h2">Sign in to your account</Text.Heading>
            <Text.Paragraph className="subtitle">
                Please enter your details.
            </Text.Paragraph>
            <TextInput
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
            />
            <TextInput
                name="password"
                type="password"
                label="Password"
                autoComplete="password"
            />

            <Button
                block
                className="abc"
                appearance="primary"
                style={{ marginBottom: 20 }}
            >
                Login
            </Button>
            <ButtonGroup alignChildren="center">
                <Link to={AUTH_ROUTES.passwordResetEmail}>
                    Forgot password?
                </Link>
            </ButtonGroup>
        </Form>
    );
}
