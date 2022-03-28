import { Button, Heading, Paragraph } from "evergreen-ui";
import { Form, Link, LinksFunction } from "remix";
import { TextInput } from "~/components";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { AuthController } from "~/controllers/admin/AuthController";
import { ActionDataFunction } from "~/utils/remix";
import { AUTH_ROUTES } from "./admin";

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: require("./admin.auth.login.css") }];
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
      <Heading size={700}>Welcome back!</Heading>
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
      <Button>Login</Button>
    </Form>
  );
}
