import { Link, NavLink } from "remix";
import cx from "classnames";

export let Sidebar: React.FC = function () {
  return (
    <>
      <NavLink to="/admin/articles" className={getClassName}>
        articles
      </NavLink>
      <NavLink to="/admin/users" className={getClassName}>
        users
      </NavLink>
      <Link to="/auth/logout">Log out</Link>
    </>
  );
};

function getClassName(props: { isActive: boolean }): string {
  return cx({
    "block-link": true,
    "block-link-active": props.isActive,
  });
}
