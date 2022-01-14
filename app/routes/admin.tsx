import { LinksFunction, NavLink, Outlet } from "remix";
import styles from "~/styles/admin.css";
import cx from "classnames";

export const links: LinksFunction = function () {
  return [
    { rel: "stylesheet", href: styles },
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

function getClassName(props: { isActive: boolean }): string {
  return cx({
    "block-link": true,
    "block-link-active": props.isActive,
  });
}

export default function AdminRoute() {
  return (
    <div className="container">
      <div className="sidebar">
        <NavLink to="/admin/articles" className={getClassName}>
          articles
        </NavLink>
        <NavLink to="/admin/users" className={getClassName}>
          users
        </NavLink>
      </div>
      <div className="main">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
