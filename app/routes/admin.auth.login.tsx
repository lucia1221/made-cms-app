import { Form, Link, LinksFunction } from "remix";
import { TextInput } from "~/components/form/TextInput";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { Heading } from "~/components/heading/Heading";
import { Paragraph } from "~/components/paragraph/Paragraph";
import { AuthController } from "~/controllers/admin/AuthController";
import { ActionDataFunction } from "~/utils/remix";
import { AUTH_ROUTES } from "./admin";
import { Button, links as buttonLinks } from "~/components/button";
import {
    ButtonGroup,
    links as buttonGroupLinks,
} from "~/components/buttonGroup";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./admin.auth.login.css") },
        ...buttonGroupLinks(),
        ...buttonLinks(),
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
            <Heading level="h1">Welcome back!</Heading>
            <Paragraph>Please enter your details.</Paragraph>
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
            <Link to={AUTH_ROUTES.passwordReset}>Forgot password</Link>
            <ButtonGroup alignChildren="end">
                <Button appearance="primary">Login</Button>
            </ButtonGroup>
        </Form>
    );
}
