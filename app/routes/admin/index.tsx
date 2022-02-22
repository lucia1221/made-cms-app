import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = async function ({ request }) {
  const url = new URL(request.url);

  if (url.pathname === "/admin" || url.pathname === "/admin/") {
    return redirect("/admin/articles");
  }

  return null;
};

export default function AdminIndex() {
  return null;
}
