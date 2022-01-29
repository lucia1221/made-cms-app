import {
  LinksFunction,
  LoaderFunction,
  NavLink,
  Outlet,
  redirect,
} from "remix";
import { Sidebar } from "~/components/admin";
import { authenticator } from "~/services/auth.server";
import adminStyles from "~/styles/admin.css";
import adminFormStyles from "~/styles/admin.form.css";

export const links: LinksFunction = function () {
  return [
    { rel: "stylesheet", href: adminStyles },
    { rel: "stylesheet", href: adminFormStyles },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    },
  ];
};

export const loader: LoaderFunction = async function ({ request }) {
  let user = await authenticator.isAuthenticated(request);

  if (user === null) {
    let query = new URLSearchParams();
    query.set("redirectTo", request.url);

    return redirect(`/login?${query.toString()}`);
  }

  return null;
};

export default function AdminRoute() {
  return (
    <div className="container">
      <div className="sidebar">
        <Sidebar></Sidebar>
      </div>
      <div className="main">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
