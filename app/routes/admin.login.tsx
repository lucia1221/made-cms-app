import { ActionFunction, Form } from "remix";
import { databaseService } from "~/services/databaseService";
import { getUserLoginSchema } from "~/utils/validationSchemas";

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();
  const email = form.get("email")?.toString() ?? "";
  const password = form.get("password")?.toString() ?? "";

  let schema = getUserLoginSchema();
  try {
    let user = await schema.validate({
      password: form.get("password")?.toString(),
      email: form.get("email")?.toString(),
    });
    let response = await databaseService().auth.signIn(user);
    console.log(response);
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default function LoginRoute() {
  return (
    <Form method="post">
      <input name="email" type="email" placeholder="Email address"></input>
      <input name="password" type="password" placeholder="Password"></input>
      <button>Login</button>
    </Form>
  );
}
