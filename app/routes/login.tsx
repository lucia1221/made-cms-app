import {
  Form,
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { authenticator } from "~/services/auth.server";

interface Data {
  redirectUrl: string;
}

export default function Screen() {
  let data = useLoaderData<Data>();
  return (
    <Form method="post">
      <input type="hidden" name="redirectUrl" value={data.redirectUrl}></input>
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}

export let action: ActionFunction = async ({ request }) => {
  let form = await request.formData();
  console.log(form);

  let redirectUrl = form.get("redirectUrl") as string | null;

  return await authenticator.authenticate("user-pass", request, {
    successRedirect: redirectUrl ?? "/admin",
    failureRedirect: "/login",
  });
};

export let loader: LoaderFunction = async ({ request }): Promise<Data> => {
  let url = new URL(request.url);
  let redirectUrl = url.searchParams.get("redirectTo");
  console.log(redirectUrl);

  let auth = await authenticator.isAuthenticated(request);

  return {
    redirectUrl: redirectUrl ?? "",
  };
};
