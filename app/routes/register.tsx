import { Button, Heading, Paragraph } from "evergreen-ui";
import {
  Form,
  json,
  LinksFunction,
  redirect,
  useSearchParams,
  useTransition,
} from "remix";
import { ValidationError } from "yup";
import { TextInput } from "~/components";
import { createFormValidationCatchBoundary } from "~/components/CatchBoundary";
import { registerUser, UserRegistrationData } from "~/services/userService";
import { ActionDataFunction } from "~/utils/remix";
import routeStyle from "./register.css";

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: routeStyle }];
};

export let action: ActionDataFunction = async function ({ request }) {
  let form = await request.formData();

  let user: UserRegistrationData = {
    firstName: form.get<string>("firstName") ?? "",
    lastName: form.get<string>("lastName") ?? "",
    password: form.get<string>("password") ?? "",
    email: form.get<string>("email") ?? "",
  };

  try {
    await registerUser(form.get<string>("token") ?? "", user);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw json(error, { status: 422 });
    } else {
      throw json(error, { status: 400 });
    }
  }

  return redirect("/admin");
};

export const CatchBoundary = createFormValidationCatchBoundary(RegisterRoute);

export default function RegisterRoute() {
  let [searchParams] = useSearchParams();

  let transition = useTransition();

  return (
    <Form method="post" className="register-user">
      <Heading size={700}>Welcome to the team</Heading>
      <Paragraph>
        All invited people will be granted access to all sites within your
        organisation
      </Paragraph>
      <fieldset disabled={transition.state === "submitting"}>
        <TextInput name="firstName" label="First name" defaultValue="abc" />
        <TextInput name="lastName" label="Last name" defaultValue="abc" />
        <TextInput
          name="email"
          label="E-mail"
          autoComplete="username"
          defaultValue={searchParams.get("email") ?? ""}
        />
        <TextInput
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          defaultValue="abcccccccc"
        />
        <input
          name="token"
          defaultValue={searchParams.get("token") ?? ""}
          type="hidden"
        />
        <Button appearance="primary">Register</Button>
      </fieldset>
    </Form>
  );
}
