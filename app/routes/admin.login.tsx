import { Button, Heading, Paragraph } from "evergreen-ui";
import { Form, json, Link, LinksFunction } from "remix";
import { ValidationError } from "yup";
import { TextInput } from "~/components";
import { authenticateUser } from "~/services/authService.server";
import { ActionDataFunction } from "~/utils/remix";
import routeStyle from "./admin.login.css";
import { createFormValidationCatchBoundary } from "./admin.users.invite";

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: routeStyle }];
};

export const action: ActionDataFunction = async function ({ request }) {
  const form = await request.formData();

  try {
    await authenticateUser(
      form.get<string>("email") ?? "",
      form.get<string>("password") ?? "",
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      throw json(error, { status: 422 });
    } else {
      throw json(error, { status: 400 });
    }
  }

  return null;
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
      <Link to={"/admin/forgot-password"}>Forgot password</Link>
      <Button>Login</Button>
    </Form>
  );
}
