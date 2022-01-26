import { ActionFunction, Form } from "remix";
import { getUserResetSchema } from "~/utils/validationSchemas";

export const action: ActionFunction = async function ({ request }) {
  let form = await request.formData();

  let schema = getUserResetSchema();
  try {
    let user = await schema.validate({
      email: form.get("email")?.toString(),
    });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default function PasswordResetRoute() {
  return (
    <Form method="post">
      <input name="email" type="email" placeholder="Email address"></input>
      <button type="submit">Send</button>
    </Form>
  );
}
