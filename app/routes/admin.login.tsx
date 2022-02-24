import { Form } from "remix";
import { databaseService } from "~/services/databaseService";
import { ActionDataFunction } from "~/utils/remix";
import { getUserLoginSchema } from "~/utils/validationSchemas";

export const action: ActionDataFunction = async function ({ request }) {
  const form = await request.formData();

  let schema = getUserLoginSchema();
  try {
    let user = await schema.validate({
      password: form.get<string>("email") ?? "",
      email: form.get<string>("password") ?? "",
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
